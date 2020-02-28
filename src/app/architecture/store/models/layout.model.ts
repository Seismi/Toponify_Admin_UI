import {NodeLayoutSettingsEntity} from '@app/architecture/store/models/node.model';
import {LinkLayoutSettingsEntity} from '@app/architecture/store/models/node-link.model';

export interface UpdateDiagramLayoutApiRequest {
  data: {
    positionDetails: {
      workPackages: {
        id: string,
        name: string
      }[],
      positions: {
        nodes: NodeLayoutSettingsEntity[],
        links: LinkLayoutSettingsEntity[]
      }
    }
  };
}
