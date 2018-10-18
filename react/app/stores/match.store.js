export default class MatchStore {
  constructor(rootStore) {
    this.rootStore = rootStore
    this.host = 'http://ec2-34-228-225-161.compute-1.amazonaws.com:8080/PictureYourself/'
  }
  fetchPostList(cb) {
    const { posts } = this.rootStore;
    let url = this.host
              + 'match?country='
              + posts.Country
    console.log(url)
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        cb(responseJson.postList)
      })
      .catch((error) => {
        console.error(error)
      })
  }
}
