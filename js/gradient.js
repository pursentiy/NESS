var granimInstance = new Granim({
  element: '#canvas-image',
  name: 'basic-gradient',
  direction: 'left-right', // 'diagonal', 'top-bottom', 'radial'
  opacity: [1, 1],
  isPausedWhenNotInView: true,
  states : {
      "default-state": {
          gradients: [
              ['#23A6D5', '#23D5AB'],
              ['#23D5AB', '#23A6D5']
          ]
      }
  }
});

var granimInstance = new Granim({
    element: '#canvas-image-bottom',
    name: 'basic-gradient',
    direction: 'left-right', // 'diagonal', 'top-bottom', 'radial'
    opacity: [1, 1],
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                ['#23A6D5', '#23D5AB'],
                ['#23D5AB', '#23A6D5']
            ]
        }
    }
  });