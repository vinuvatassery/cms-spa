/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AfterViewInit, OnDestroy } from '@angular/core';
/** External libraries **/
import { saveAs } from '@progress/kendo-file-saver';
import {
  Surface,
  Path,
  Group,
  geometry,
  exportSVG,
} from '@progress/kendo-drawing';

const { Point } = geometry;

@Component({
  selector: 'common-signature-pad',
  templateUrl: './signature-pad.component.html',
  styleUrls: ['./signature-pad.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignaturePadComponent implements AfterViewInit, OnDestroy {
  /** Private properties **/
  @ViewChild('surface', { static: false })
  private surfaceElement!: ElementRef;
  private surface: any;
  private path: any;
  private root: Group = new Group();

  /** Public properties **/
  isEmpty = true;

  /** Lifecycle hooks **/
  ngOnDestroy() {
    this.surface.destroy();
  }

  ngAfterViewInit(): void {
    this.surface = Surface.create(this.surfaceElement.nativeElement);
    this.surface.draw(this.root);
  }

  /** Public methods **/
  pointFromEvent(e: any): any {
    if (!e.isPrimary) {
      // Comment to draw with all pointers.
      // Not really useful for signatures, but can be fun.
      return;
    }
    const offset = {
      top: this.surfaceElement.nativeElement.offsetTop,
      left: this.surfaceElement.nativeElement.offsetLeft,
    };
    return new Point(e.pageX - offset.left, e.pageY - offset.top - 70);
  }

  /** Internal event methods **/
  onClearClicked() {
    this.root.clear();
    this.isEmpty = true;
  }

  onExportClicked() {
    // Render the result as a SVG document
    exportSVG(this.root).then(function (data) {
      // Save the SVG document
      saveAs(data, 'signature.svg');
    });
  }

  onPointerMoved = (e: any) => {
    if (!this.path) {
      return;
    }
    this.isEmpty = false;
    const newPoint = this.pointFromEvent(e);
    this.path.lineTo(newPoint);
  };

  onPointerDownClicked = (e: any) => {
    this.surfaceElement.nativeElement.setPointerCapture(e.pointerId);
    this.path = new Path({
      stroke: {
        color: '#000000',
        width: 2,
        lineCap: 'round',
        lineJoin: 'round',
      },
    });
    this.root.append(this.path);
    const newPoint = this.pointFromEvent(e);
    for (let i = 0; i < 1; i++) {
      this.path.lineTo(newPoint.clone().translate(i * 1, 0));
    }
  };

  onPointerUpClicked = (e: any) => {
    this.surfaceElement.nativeElement.releasePointerCapture(e.pointerId);
    this.path = null;
  };
}
