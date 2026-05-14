(function () {
  var openButton = document.querySelector('[data-smart-contact-open]');
  var modal = document.querySelector('[data-smart-contact-modal]');

  if (!openButton || !modal) {
    return;
  }

  var dialog = modal.querySelector('.smart-contact-dialog');
  var form = modal.querySelector('.smart-contact-form');
  var closeButtons = modal.querySelectorAll('[data-smart-contact-close]');
  var statusMessage = modal.querySelector('[data-smart-contact-status]');
  var submitButton = modal.querySelector('.smart-contact-submit');
  var submitText = modal.querySelector('[data-smart-contact-submit-text]');
  var firstField = form ? form.querySelector('input[name="name"]') : null;
  var lastFocusedElement = null;
  var formStartedAt = null;
  var isSubmitting = false;
  var toastRegion = null;
  var activeToast = null;
  var toastTimer = null;
  var requestTimeoutMs = 25000;
  var processingToastDurationMs = 2500;
  var toastExitDurationMs = 180;
  var processingToastStartedAt = 0;

  function getFieldValue(name) {
    var field = form.elements[name];
    return field ? field.value.trim() : '';
  }

  function getWebhookDomain() {
    var webhookUrl = form ? form.getAttribute('data-webhook-url') : '';

    try {
      return webhookUrl ? new URL(webhookUrl).hostname : '';
    } catch (error) {
      return '';
    }
  }

  function getDebugContext(extra) {
    var messageLength = extra && typeof extra.messageLength === 'number' ? extra.messageLength : getFieldValue('message').length;
    var requestType = extra && extra.requestType ? extra.requestType : getFieldValue('request_type');
    var context = {
      timestamp: new Date().toISOString(),
      requestType: requestType,
      messageLength: messageLength,
      webhookDomain: getWebhookDomain()
    };

    return Object.assign(context, extra || {});
  }

  function getPayloadDebug(payload) {
    return {
      requestType: payload.request_type,
      messageLength: payload.message.length
    };
  }

  function logContactForm(extra) {
    if (!window.console || typeof window.console.info !== 'function') {
      return;
    }

    window.console.info('[contact-form]', getDebugContext(extra));
  }

  function ensureToastRegion() {
    if (toastRegion) {
      return toastRegion;
    }

    toastRegion = document.createElement('div');
    toastRegion.className = 'contact-toast-region';
    toastRegion.setAttribute('aria-live', 'polite');
    toastRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastRegion);

    return toastRegion;
  }

  function clearToastTimer() {
    if (toastTimer) {
      window.clearTimeout(toastTimer);
      toastTimer = null;
    }
  }

  function dismissContactToast() {
    clearToastTimer();

    if (activeToast) {
      var toastToRemove = activeToast;
      toastToRemove.classList.remove('is-visible');

      window.setTimeout(function () {
        if (toastToRemove.parentNode) {
          toastToRemove.parentNode.removeChild(toastToRemove);
        }

        if (activeToast === toastToRemove) {
          activeToast = null;
        }
      }, toastExitDurationMs);
    }
  }

  function scheduleToastDismiss(options) {
    clearToastTimer();

    if (options && options.persist) {
      return;
    }

    toastTimer = window.setTimeout(dismissContactToast, options && options.duration ? options.duration : 6500);
  }

  function showContactToast(type, message, options) {
    var region = ensureToastRegion();

    clearToastTimer();
    region.textContent = '';

    activeToast = document.createElement('div');
    activeToast.className = 'contact-toast contact-toast-' + type;
    activeToast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    var indicator = document.createElement('span');
    indicator.className = 'contact-toast-indicator';
    indicator.setAttribute('aria-hidden', 'true');

    var text = document.createElement('p');
    text.className = 'contact-toast-message';
    text.textContent = message;

    var closeButton = document.createElement('button');
    closeButton.className = 'contact-toast-close';
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Fermer la notification');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', dismissContactToast);

    activeToast.appendChild(indicator);
    activeToast.appendChild(text);
    activeToast.appendChild(closeButton);
    region.appendChild(activeToast);

    window.setTimeout(function () {
      if (activeToast) {
        activeToast.classList.add('is-visible');
      }
    }, 20);

    scheduleToastDismiss(options);
  }

  function updateContactToast(type, message, options) {
    if (!activeToast) {
      showContactToast(type, message, options);
      return;
    }

    activeToast.className = 'contact-toast contact-toast-' + type + ' is-visible';
    activeToast.setAttribute('role', type === 'error' ? 'alert' : 'status');

    var text = activeToast.querySelector('.contact-toast-message');

    if (text) {
      text.textContent = message;
    }

    scheduleToastDismiss(options);
  }

  function waitForProcessingToast(callback) {
    var elapsed = Date.now() - processingToastStartedAt;
    var remaining = Math.max(processingToastDurationMs + toastExitDurationMs + 80 - elapsed, 0);

    window.setTimeout(callback, remaining);
  }

  function setStatus(type, message) {
    if (!statusMessage) {
      return;
    }

    statusMessage.classList.remove('is-success', 'is-error', 'is-info');

    if (type) {
      statusMessage.classList.add('is-' + type);
    }

    statusMessage.textContent = message || '';
  }

  function setLoading(isLoading) {
    if (!submitButton || !submitText) {
      return;
    }

    submitButton.disabled = isLoading;
    submitButton.classList.toggle('is-loading', isLoading);
    form.classList.toggle('is-submitting', isLoading);
    submitText.textContent = isLoading ? 'Envoi en cours' : 'Envoyer la demande';

    if (isLoading) {
      form.setAttribute('aria-busy', 'true');
      setStatus('info', 'Traitement de votre demande par le workflow n8n...');
    } else {
      form.removeAttribute('aria-busy');
    }
  }

  function clearValidation() {
    form.querySelectorAll('.is-invalid').forEach(function (field) {
      field.classList.remove('is-invalid');
    });
  }

  function openModal() {
    if (isSubmitting) {
      processingToastStartedAt = Date.now();
      showContactToast('processing', 'Votre formulaire est en cours d’envoi.', {
        duration: processingToastDurationMs
      });
      return;
    }

    lastFocusedElement = document.activeElement;
    formStartedAt = new Date().toISOString();

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('smart-contact-no-scroll');
    setStatus('', '');
    clearValidation();

    window.setTimeout(function () {
      if (firstField) {
        firstField.focus();
      } else if (dialog) {
        dialog.focus();
      }
    }, 40);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('smart-contact-no-scroll');

    if (!isSubmitting) {
      setLoading(false);
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function resetFormAfterLaunch() {
    form.reset();
    clearValidation();
    setStatus('', '');
    formStartedAt = new Date().toISOString();
  }

  function buildPayload() {
    return {
      name: getFieldValue('name'),
      email: getFieldValue('email'),
      company: getFieldValue('company'),
      website_or_linkedin: getFieldValue('website_or_linkedin'),
      request_type: getFieldValue('request_type'),
      budget_context: getFieldValue('budget_context'),
      urgency: getFieldValue('urgency'),
      message: getFieldValue('message'),
      metadata: {
        source: 'portfolio',
        origin_page: 'home',
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        form_started_at: formStartedAt,
        submitted_at: new Date().toISOString()
      }
    };
  }

  function validateForm() {
    var requiredFields = form.querySelectorAll('[required]');
    var emailField = form.elements.email;
    var firstInvalidField = null;

    clearValidation();

    requiredFields.forEach(function (field) {
      if (!field.value.trim()) {
        field.classList.add('is-invalid');

        if (!firstInvalidField) {
          firstInvalidField = field;
        }
      }
    });

    if (firstInvalidField) {
      firstInvalidField.focus();
      setStatus('error', 'Merci de remplir les champs obligatoires avant l’envoi.');
      logContactForm({
        event: 'submit_failed',
        reason: 'validation_error',
        validation: 'failed',
        validationIssue: 'required_field'
      });
      return null;
    }

    if (emailField && !emailField.checkValidity()) {
      emailField.classList.add('is-invalid');
      emailField.focus();
      setStatus('error', 'Merci d’indiquer une adresse email valide.');
      logContactForm({
        event: 'submit_failed',
        reason: 'validation_error',
        validation: 'failed',
        validationIssue: 'invalid_email'
      });
      return null;
    }

    return buildPayload();
  }

  function createTimeoutSignal() {
    if (typeof AbortController !== 'function') {
      return null;
    }

    var controller = new AbortController();
    var timeoutId = window.setTimeout(function () {
      controller.abort();
    }, requestTimeoutMs);

    return {
      controller: controller,
      clear: function () {
        window.clearTimeout(timeoutId);
      }
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form || isSubmitting) {
      return;
    }

    if (getFieldValue('website_check')) {
      isSubmitting = true;
      closeModal();
      resetFormAfterLaunch();
      showContactToast('success', 'Votre demande a bien été envoyée. Un email de confirmation vous a été transmis.', {
        duration: 5200
      });
      logContactForm({
        event: 'submit_ignored',
        reason: 'honeypot'
      });
      isSubmitting = false;
      setLoading(false);
      return;
    }

    var payload = validateForm();

    if (!payload) {
      return;
    }

    var webhookUrl = form.getAttribute('data-webhook-url');
    var debugPayload = getPayloadDebug(payload);

    if (!webhookUrl) {
      setStatus('error', 'Le service de traitement est temporairement indisponible. Vous pouvez réessayer ou me contacter directement par email.');
      logContactForm(Object.assign({
        event: 'submit_failed',
        reason: 'webhook_unavailable'
      }, debugPayload));
      return;
    }

    isSubmitting = true;
    setLoading(true);
    logContactForm(Object.assign({
      event: 'portfolio-contact-submit-start',
      validation: 'OK'
    }, debugPayload));
    closeModal();
    resetFormAfterLaunch();
    processingToastStartedAt = Date.now();
    showContactToast('processing', 'Votre formulaire est en cours d’envoi.', {
      duration: processingToastDurationMs
    });

    var timeoutRequest = createTimeoutSignal();
    var fetchOptions = {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };

    if (timeoutRequest) {
      fetchOptions.signal = timeoutRequest.controller.signal;
    }

    fetch(webhookUrl, fetchOptions)
      .then(function (response) {
        if (!response.ok) {
          logContactForm(Object.assign({
            event: 'submit_failed',
            reason: response.status >= 500 ? 'temporary_server_error' : 'http_error',
            status: response.status
          }, debugPayload));

          throw new Error(response.status >= 500 ? 'temporary_server_error' : 'http_error');
        }

        waitForProcessingToast(function () {
          updateContactToast('success', 'Votre demande a bien été envoyée. Un email de confirmation vous a été transmis.', {
            duration: 6500
          });
        });
        logContactForm(Object.assign({
          event: 'submit_success',
          validation: 'OK',
          status: response.status
        }, debugPayload));
      })
      .catch(function (error) {
        var reason = error && error.message ? error.message : 'cors_or_fetch_error';
        var isTimeout = error && error.name === 'AbortError';
        var isNetworkError = reason === 'Failed to fetch' || reason === 'NetworkError when attempting to fetch resource.';
        var wasHttpLogged = reason === 'http_error' || reason === 'temporary_server_error';

        if (!wasHttpLogged) {
          logContactForm(Object.assign({
            event: 'submit_failed',
            reason: isTimeout ? 'timeout_error' : isNetworkError ? 'network_error' : 'cors_or_fetch_error'
          }, debugPayload));
        }

        waitForProcessingToast(function () {
          updateContactToast(
            'error',
            isTimeout
              ? 'Le traitement prend plus de temps que prévu. Vous pouvez réessayer ou me contacter directement par email.'
              : 'L’envoi a échoué. Vous pouvez réessayer ou me contacter directement par email.',
            {
              duration: 8000
            }
          );
        });
      })
      .finally(function () {
        if (timeoutRequest) {
          timeoutRequest.clear();
        }

        isSubmitting = false;
        setLoading(false);
      });
  }

  openButton.addEventListener('click', openModal);

  closeButtons.forEach(function (button) {
    button.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
})();
