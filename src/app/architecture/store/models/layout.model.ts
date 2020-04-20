import {NodeLayoutSettingsEntity} from '@app/architecture/store/models/node.model';
import {LinkLayoutSettingsEntity} from '@app/architecture/store/models/node-link.model';

export const autoLayoutId = '00000000-0000-0000-0000-000000000000';

export interface UpdateDiagramLayoutApiRequest {
  data: {
    positionDetails: {
      workPackages: {
        id: string,
        name: string
      }[],
      positions: {
        nodes: NodeLayoutSettingsEntity['layout'][],
        nodeLinks: LinkLayoutSettingsEntity['layout'][]
      }
    }
  };
}
