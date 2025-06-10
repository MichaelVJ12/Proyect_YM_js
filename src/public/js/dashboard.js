// Animación Sidebar
const hamburger = document.querySelector(".toggle-btn");
const toggle = document.querySelector("#icon");
hamburger.addEventListener("click", function() {
    document.querySelector("#sidebar").classList.toggle("expand");
    toggle.classList.toggle("bxs-chevrons-right");
    toggle.classList.toggle("bxs-chevrons-left");
});

// Control del cuadro de color en inventario
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".color-badge").forEach(badge => {
        const color = badge.getAttribute("data-color");
        if (color) {
            badge.style.backgroundColor = color;
        }
    });
});

// Datos de para el gráfico de barras
new Chart(document.getElementById("line-chart"), { 
  type: 'line',
  data: {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      { 
        data: ventasMesActual,
        label: "Mes Actual",
        borderColor: "#3e95cd",
        fill: false
      }, 
      { 
        data: ventasMesPasado,
        label: "Mes Pasado",
        borderColor: "#8e5ea2",
        fill: false
      } 
    ]
  },
  options: {
    title: {
      display: true,
      text: 'Ventas del Mes Actual y Mes Pasado'
    },
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Código para manejar el cierre de sesión
const logout = document.getElementById("logout");

if (logout) {
  logout.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("/api/logout", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' }
      });

      const resultado = await respuesta.json();

      if (resultado.success) {
        window.location.href = "/"; 
      } else {
        console.error("Fallo al cerrar sesión:", resultado.message);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  });
}


