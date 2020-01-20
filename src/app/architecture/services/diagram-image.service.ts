import * as go from 'gojs';
import mergeImages from 'merge-images';

export class DiagramImageService {
  constructor(
  ) {

  }

  // Create an image of the diagram as currently displayed
  createImage(diagram: go.Diagram): Promise<string> {
    return new Promise(function(resolve, reject) {
      diagram.makeImageData({
        type: 'image/jpeg',
        returnType: 'string',
        background: 'white',
        callback: function(image) {
          resolve(image);
        }
      });
    });
  }

  // Return the width of an image
  getImageWidth(image: string): Promise<number> {
    return new Promise(function(resolve, reject): void {
      const i = new Image();
      i.onload = function() {
        resolve(i.width);
      };
      i.src = image;
    });
  }

  // Attach Toponify logo to the top right of the image
  addLogo(image: string): Promise<string> {

    const logoPath = 'assets/images/logo_transparent_background_small.png';

    const getDiagramImageWidth = this.getImageWidth(image);
    const getLogoWidth = this.getImageWidth(logoPath);

    return Promise.all([getDiagramImageWidth, getLogoWidth])
      .then(function([diagramWidth, LogoWidth]: number[]): Promise<string> {

        return mergeImages([
          { src: image},
          {
            src: logoPath,
            // Ensure that the logo is right-aligned against the image
            x: diagramWidth - LogoWidth,
            y: 0
          }
        ], {
          format: 'image/jpeg'
        });
      });
  }

  // Download image of the current view of the diagram with Toponify logo attached
  downloadImage(diagram: go.Diagram): void {

    this.createImage(diagram)
      .then(this.addLogo.bind(this))
      .then(
        function(image: string): void {

          // Add datestamp to file name - YYYYMMDD
          const currentDate = new Date();
          const dateStamp = currentDate.getFullYear().toString()
            + ('0' + (currentDate.getMonth() + 1).toString()).substr(-2)
            + ('0' + currentDate.getDate().toString()).substr(-2);

          const filename = dateStamp + '_' + 'diagram.jpg';

          // Temporary anchor element to initiate download
          const anchor = document.createElement('a');

          anchor.style.display = 'none';
          anchor.href = image;
          anchor.download = filename;

          // IE 11
          if (window.navigator.msSaveBlob !== undefined) {
            window.navigator.msSaveBlob(image, filename);
            return;
          }

          document.body.appendChild(anchor);
          requestAnimationFrame(function() {
            anchor.click();
            window.URL.revokeObjectURL(image);
            document.body.removeChild(anchor);
          });
        }
      );
  }
}
