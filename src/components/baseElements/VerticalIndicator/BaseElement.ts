export interface IElementProps {
    label?: string;
    value?: any;
    state?: 'default' | 'active' | 'error';
    onCommand?: (cmd: string, payload?: any) => void;
  }
  