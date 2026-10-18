'use strict';
(() => {
  const form = document.querySelector('#newsletter-form');
  if (!form) return;
  const phoneChoice = form.querySelector('#newsletter-whatsapp');
  const phoneWrap = form.querySelector('#newsletter-phone-wrap');
  const phone = form.querySelector('#newsletter-phone');
  const status = form.querySelector('#newsletter-status');
  const submit = form.querySelector('button[type="submit"]');
  const substackNext = form.querySelector('#newsletter-substack-next');
  function updatePhone() {
    phoneWrap.hidden = !phoneChoice.checked;
    phone.required = phoneChoice.checked;
    if (!phoneChoice.checked) phone.value = '';
  }
  phoneChoice.addEventListener('change', updatePhone);
  updatePhone();
  async function checkConnection() {
    try {
      const response = await fetch('/api/newsletter?action=status', {cache: 'no-store', signal: AbortSignal.timeout(10000)});
      const data = await response.json();
      submit.disabled = !data.configured;
      status.textContent = data.configured ? '' : 'El registro de preferencias aún no está activo. La suscripción por correo sí está disponible en Substack.';
    } catch {
      submit.disabled = true;
      status.textContent = 'No pudimos comprobar el registro. Puedes suscribirte por correo directamente en Substack.';
    }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    const channels = [...form.querySelectorAll('input[name="channels"]:checked')].map(input => input.value);
    if (!channels.length) { status.textContent = 'Elige al menos un lugar para recibir las noticias.'; return; }
    const data = {email: form.elements.email.value.trim(), channels, phone: phoneChoice.checked ? phone.value.trim() : '', consent: form.elements.consent.checked};
    submit.disabled = true;
    status.textContent = 'Guardando tus preferencias…';
    substackNext.hidden = true;
    try {
      const response = await fetch('/api/newsletter', {method: 'POST', credentials: 'same-origin', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data), signal: AbortSignal.timeout(15000)});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No pudimos guardar tus preferencias.');
      status.textContent = channels.includes('email') ? 'Tus preferencias quedaron guardadas. Confirma la carta por correo en Substack para empezar a recibirla.' : 'Tus preferencias quedaron guardadas. Alpaca te avisará por los canales que elegiste.';
      substackNext.hidden = !channels.includes('email');
      form.reset();
      updatePhone();
    } catch (error) { status.textContent = error.message || 'No pudimos guardar tus preferencias. Intenta de nuevo.'; }
    finally { submit.disabled = false; }
  });
  void checkConnection();
})();
