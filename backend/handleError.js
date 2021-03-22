const handleError = (err, res) => {
  if (err.message === 'Not found') {
    res.status(404).send({ message: 'Объект не найден' });
  } else if (err.name === 'CastError') {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  } else {
    res.status(500).send({ message: err.message });
  }
};

module.exports = handleError;
