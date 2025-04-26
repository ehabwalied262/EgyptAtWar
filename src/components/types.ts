export interface YouTubeChannel {
    id: string;
    snippet: {
      title: string;
      description: string;
      thumbnails: { medium: { url: string } };
    };
    userDescription?: string;
    badges?: string[];
    likes?: number;
    addedBy?: string;
  }
  
  export interface ChannelConfig {
    handle: string;
    description?: string;
    badges?: string[];
    addedBy?: string;
  }
  
  export interface Categories {
    [key: string]: ChannelConfig[];
  }
  
  export interface ChannelItemProps {
    channel: ChannelConfig;
    onEdit: (channel: ChannelConfig) => void;
    onDelete: (handle: string) => void;
    onShowDetails: (channel: YouTubeChannel) => void;
    userId: string;
  }