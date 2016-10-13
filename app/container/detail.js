import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardText, List, ListItem, Avatar, Divider } from 'material-ui';
import { fetchDetail } from '../actions/index.js';
// import { getRichEditorState } from '../actions/richeditorAction.js';
import RichEditor from '../components/richeditor/index.js';
import { fetchCommnet } from '../actions/commentAction.js';

class Detail extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    author: PropTypes.object.isRequired,
    createAt: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    replies: PropTypes.array.isRequired,
    loginStatus: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, params } = this.props;
    dispatch(fetchDetail('topic', params.id));
  }

  _onHandleClick = (state) => {
    const { dispatch, params } = this.props;
    const comment = {
      content: state
    };
    dispatch(fetchCommnet(params.id, comment));
  }

  render() {
    const { author, createAt, title, content, replies, loginStatus } = this.props;
    return(
      <div className="detail">
        <Card className="card">
          <CardHeader
            title={author.loginname}
            subtitle={'发布于' + createAt}
            avatar={
              <Link to={'/user/' + author.loginname}>
                <Avatar src={author.avatar_url} />
              </Link>
            }
          />
          <CardTitle title={title}/>
          <CardText dangerouslySetInnerHTML={{__html: content}}/>
          <CardHeader title="评论"/>
          {
            replies.map((val, index) =>
              <List key={index}>
                <ListItem
                  leftAvatar={<Link to={'/user/' + val.author.loginname}>
                    <Avatar title={val.author.loginname} src={val.author.avatar_url} />
                  </Link>}
                  primaryText={<div dangerouslySetInnerHTML={{__html: val.content }}/>}
                />
                <Divider inset/>
              </List>
            )
          }
        </Card>
        <Card className="card richeditor">
          {
            loginStatus ?
            <RichEditor
              onHandleClick={this._onHandleClick}
            /> : ''
          }
        </Card>
      </div>
    );
  }
}

function select(state) {
  return {
    author: state.topicDetail.author,
    createAt: state.topicDetail.create_at,
    title: state.topicDetail.title,
    content: state.topicDetail.content,
    replies: state.topicDetail.replies,
    loginStatus: state.loginUserData.success
  };
}

export default connect(select)(Detail);
