import ConfigStore from './config.store';
import PostStore from './post.store';
import MatchStore from './match.store';

export default class RootStore {
  constructor() {
    this.config = new ConfigStore(this)
    this.posts = new PostStore(this)
    this.matches = new MatchStore(this)
  }
}
