// Mostrar errores en los form
function mostrarErrores(formId, errores) {
  const formulario = document.getElementById(formId);
  limpiarErroresFormulario(formulario);

  errores.forEach(error => {
    if (error.param) {
      const campo = formulario.querySelector(`[name="${error.param}"]`);
      if (campo) {
        campo.classList.add('is-invalid');
        const feedback = campo.parentElement.querySelector('.invalid-feedback');
        if (feedback && feedback.textContent === '') {
          feedback.textContent = error.msg;
        }
      }
    } else {
      const alerta = formulario.querySelector('.alert');
      if (alerta) {
        alerta.textContent = error.msg;
        alerta.classList.remove('d-none');
      }
    }
  });
}

function limpiarErroresFormulario(formulario) {
  formulario.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  formulario.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');

  const alerta = formulario.querySelector('.alert');
  if (alerta) {
    alerta.classList.add('d-none');
    alerta.textContent = '';
  }
}

function limpiarFormulario(formulario) {
  formulario.reset();
  limpiarErroresFormulario(formulario);
}

// Elimina errores visuales al escribir
document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
    const feedback = input.parentElement.querySelector('.invalid-feedback');
    if (feedback) feedback.textContent = '';
  });
});

// Registro
const registro = document.getElementById("form-register");
if (registro) { registro.addEventListener("submit", async(e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const respuesta = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      mostrarErrores('form-register', resultado.errores);
    } else {
      const registroModal = bootstrap.Modal.getInstance(document.getElementById('register-modal'));
      registroModal.hide();
      const confirmacionModal = new bootstrap.Modal(document.getElementById('confirmacion-modal'));
      confirmacionModal.show();
      form.reset();
    }
  } catch (error) {
    console.error(error);
  }
});
}

// Login
const login = document.getElementById("form-login");
if(login) {login.addEventListener("submit", async(e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const respuesta = await fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const resultado = await respuesta.json();       
    if (!respuesta.ok) {
      mostrarErrores('form-login', resultado.errores);
    } else {
      const loginModal = bootstrap.Modal.getInstance(document.getElementById('login-modal'));
      if (loginModal) loginModal.hide();
      window.location.reload();
    }
  } catch (error){
    console.error(error);
  }
});
}

if (login && registro) {
// Limpia formularios y errores al cerrar modales
['login-modal', 'register-modal'].forEach(id => {
  const modalEl = document.getElementById(id);
  modalEl.addEventListener('hidden.bs.modal', () => {
    const form = modalEl.querySelector('form');
    if (form) limpiarFormulario(form);
  });
});

// Limpia errores al cambiar entre login <-> registro
document.getElementById('Register-button').addEventListener('click', () => {
  limpiarFormulario(document.getElementById('form-login'));
});

document.getElementById('Retroceder-register').addEventListener('click', () => {
  limpiarFormulario(document.getElementById('form-register'));
});
}

// Cierre de sesión
const logout = document.getElementById("form-logout");
if (logout) {logout.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      const respuesta = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const resultado = await respuesta.json();

      if (resultado.success) {
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('profile-slap'));
        if (offcanvas) offcanvas.hide();    
        window.location.reload();
      } else {
        console.error("Fallo al cerrar sesión:", resultado.message);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
});
}

const moreAddress = document.getElementById("more-address");
if (moreAddress) {moreAddress.addEventListener('click', async() => {
        const selectDepartamento = document.getElementById("departamento");
        const selectMunicipio = document.getElementById("municipio");
        
        selectDepartamento.innerHTML = '<option value="">Seleccione un departamento</option>';
        selectMunicipio.innerHTML = '<option value="">Seleccione un municipio</option>';
        selectMunicipio.disabled = true;
        
        try {
            const respuesta = await fetch("/api/departamentos");
            const departamentos = await respuesta.json();
            
            departamentos.forEach(departamento => {
                const option = document.createElement("option");
                option.value = departamento.iddepartamento;
                option.textContent = departamento.nombre_departamento;
                selectDepartamento.appendChild(option);
            });
            
            selectDepartamento.addEventListener("change", async () => {
                const idDepartamento = selectDepartamento.value;
                selectMunicipio.innerHTML = '<option value="">Seleccione un municipio</option>';
                selectMunicipio.disabled = true;

                if (idDepartamento) {
                    try {
                        const respuesta = await fetch(`/api/municipios/${idDepartamento}`);
                        const municipios = await respuesta.json();

                        municipios.forEach(municipio => {
                            const option = document.createElement("option");
                            option.value = municipio.idmunicipio;
                            option.textContent = municipio.nombre_municipio;
                            selectMunicipio.appendChild(option);
                        });

                        selectMunicipio.disabled = false;
                    } catch (error) {
                        console.error("Error cargando municipios:", error);
                    }
                }
            });
        } catch (error) {
            console.error("Error cargando departamentos:", error);
        }
    });
}

