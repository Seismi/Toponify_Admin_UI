import * as go from 'gojs';

export class DiagramImageService {
  constructor(
  ) {

  }

  createImage(diagram: go.Diagram) {

    return new Promise(function(resolve, reject) {
      diagram.makeImageData({
        returnType: 'blob',
        callback: function(image) {
          resolve(image);
        }
      });
    });

  }

  downloadImage(diagram) {

    this.createImage(diagram)
      .then(
        function(image) {
          const url = window.URL.createObjectURL(image);
          const currentTime = new Date();
          /*const dateStamp = currentTime.getFullYear().toString()
            + ('0' + (currentTime.getMonth() + 1).toString())
            + '0' + currentTime.getDay().toString();*/
          const filename = /*dateStamp + '_' +*/ 'diagram.jpg';

          const anchor = document.createElement('a');

          // @ts-ignore
          anchor.style = 'display: none';
          anchor.href = url;
          anchor.download = filename;

          // IE 11
          if (window.navigator.msSaveBlob !== undefined) {
            window.navigator.msSaveBlob(image, filename);
            return;
          }

          document.body.appendChild(anchor);
          requestAnimationFrame(function() {
            anchor.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(anchor);
          });
        }
      );
  }
}
