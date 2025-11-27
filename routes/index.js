var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/', function(req, res, next) {
  res.render('fotos_formulario', { title: 'Photos Management' });
});

router.get('/photos', function(req, res, next) {
  res.render('fotos_formulario', { title: 'Photos Management' });
});

router.get('/photos/list', async function(req, res, next) {
  try {
    const URL = 'http://localhost:3000/fotos/findAll/json';
    const response = await axios.get(URL);
    res.render('fotos_list', { title: 'Photos List', fotos: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener fotos');
  }
});

router.get('/photos/rate', function(req, res, next) {
  res.render('fotos_rate', { title: 'Filter by Rate' });
});

router.get('/photos/filter', async function(req, res, next) {
  try {
    let { lower, higher } = req.query;
    const URL = `http://localhost:3000/fotos/findAllByRate/json?lower=${lower}&higher=${higher}`;
    const response = await axios.get(URL);
    res.render('fotos_list', { title: 'Filtered Photos', fotos: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al filtrar fotos');
  }
});

router.get('/photos/search', function(req, res, next) {
  res.render('fotos_search', { title: 'Search by ID' });
});

router.get('/photos/searchById', async function(req, res, next) {
  try {
    let { id } = req.query;
    const URL = `http://localhost:3000/fotos/findById/${id}/json`;
    const response = await axios.get(URL);
    res.render('fotos_list', { title: 'Search Result', fotos: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al buscar foto');
  }
});

router.get('/photos/edit/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const URL = `http://localhost:3000/fotos/findById/${id}/json`;
    const response = await axios.get(URL);
    if (response.data && response.data.length > 0) {
      res.render('fotos_edit', { title: 'Edit Photo', foto: response.data[0] });
    } else {
      res.status(404).send('Photo not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener foto');
  }
});

router.post('/photos/save', async function(req, res, next) {
  try {
    let { title, description, rate } = req.body;
    const URL = 'http://localhost:3000/fotos/save';
    let data = {
      titulo: title,
      descripcion: description,
      calificacion: rate,
      ruta: ''
    };
    const response = await axios.post(URL, data);
    if (response.status === 200) {
      res.redirect('/photos/list');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/photos/update', async function(req, res, next) {
  try {
    let { id, title, description, rate } = req.body;
    const URL = 'http://localhost:3000/fotos/update';
    let data = {
      id: id,
      titulo: title,
      descripcion: description,
      calificacion: rate,
      ruta: ''
    };
    const response = await axios.put(URL, data);
    if (response.status === 200) {
      res.redirect('/photos/list');
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});

router.post('/photos/delete/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const URL = `http://localhost:3000/fotos/delete/${id}`;
    const response = await axios.delete(URL);
    res.redirect('/photos/list');
  } catch (error) {
    console.error(error);
    res.redirect('/photos/list');
  }
});

module.exports = router;