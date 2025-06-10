function verificarSesion(req, res, next) {
  const usuario = req.session.usuario;

  if (usuario && (usuario.tipo === 1 || usuario.tipo === 2)) {
    next(); 
  } else {
    res.redirect('/'); 
  }
}


function redirigirSiAutenticado(req, res, next) {
  const usuario = req.session.usuario;
  
  if (usuario && (usuario.tipo === 1 || usuario.tipo === 2)) {
    return res.redirect('/dashboard');
  }

  next(); 
}

module.exports = { verificarSesion, redirigirSiAutenticado };
