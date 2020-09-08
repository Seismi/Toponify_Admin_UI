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

export enum NodeColoursDark {
  'blue' = '#112A46',
  'red' = '#5A181F',
  'green' = '#2F5318',
  'purple' = '#3B1F2B',
  'orange' = '#77350F',
  'none' = '#000000'
}

export enum NodeColoursLight {
  'blue' = '#ACC8E5',
  'red' = '#FCE7E9',
  'green' = '#E3FBD7',
  'purple' = '#D7D2D4',
  'orange' = '#F9ECE5',
  'none' = '#FFFFFF'
}

export enum NodeDetailTab {
  'Details' = 0,
  'Components' = 1,
  'Reports' = 2,
  'AttributesAndRules' = 3,
  'DocumentationStandards' = 4,
  'Radio' = 5,
  'Scopes' = 6,
  'WorkPackages' = 7
}
