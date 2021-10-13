import React, {useRef} from 'react';
import Page from '../component/page';
import Loading from '../component/loading';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Readhub from './readhub';
import {noop} from 'lib/util'
const TabsWrapper = styled.div`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
`

const TabList = styled.ul`
position: absolute;
top: 0;
left: 0;
right: 0;
background: #fff;
margin: 10px 16px;
display: flex;
padding: 0;
`
const TabItem = styled.li`
padding: 0 10px;
flex: 1;
border-bottom: 1px solid #ccc;
list-style: none;
height: 30px;
line-height: 30px;
text-align: center;
cursor: pointer;
${props => props.active && (`
  border-bottom-color: #1890ff;
`)}
`;

const TabContent = styled.div`
position: absolute;
top: 51px;
left: 0;
right: 0;
bottom: 0;
overflow: auto;
overflow-x: hidden;
transition: all .3s;
`;
const IFrame = (props) => {
  let { active, loaded } = props;
  if (!active && !loaded) return null;
  return <>
    <iframe {...props} src={props.src} frameborder="0"></iframe>
    {!loaded && <Loading />}
  </>;
}
const StyledIframe = styled(IFrame)`
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
overflow: auto;
width: 100%;
height: 100%;
border: none;
`;
const tabs = [
  {
    key: 'readhub',
    text: 'Readhub',
    component: Readhub,
  },
  {
    key: 'cnBeta',
    text: 'cnBeta',
    component: (props) => {
      return (
        <StyledIframe {...props} onLoad={props.onLoad || noop} src={'https://m.cnbeta.com'}></StyledIframe>
      )
    },
  },
  {
    key: 'frame',
    text: '网址',
    component: (props) => {
      return (
        <StyledIframe {...props} onLoad={props.onLoad || noop} src={props.src || 'https://m.baidu.com'}></StyledIframe>
      )
    },
  },
];
const Popup = (props) => {
  const names = [props.className, 'tabs'].filter(x => x).join(' ');
  const {
    popup: {
      activeKey,
      loadedKeys,
    }
  } = props;
  const activeIndex = tabs.findIndex(x => x.key === activeKey);
  const activeTab = tabs[activeIndex];
  return (
    <TabsWrapper className={names}>
      <TabList>
        {
          tabs.map((tab) => {
            return (
              <TabItem
                key={tab.key}
                active={tab === activeTab}
                onClick={() => props.dispatch({type: 'popup/updateActiveKey', payload: tab.key})}
              >
                <span>{tab.text}</span>
              </TabItem>
            )
          })
        }
      </TabList>
      {
        tabs.map((tab, index) => {
          let ContentComponent = tab.component;
          let tabLoaded = loadedKeys.includes(tab.key);
          return (
            <TabContent key={tab.key} style={{transform: `translateX(${(index - activeIndex) * 100}%)`}}>
              <ContentComponent
                active={activeTab === tab}
                loaded={tabLoaded}
                onLoad={tab.key === 'readhub'
                  ? noop
                  : () => {
                    props.dispatch({ type: 'popup/markTabLoaded', payload: tab.key })
                  }
                }
              />
            </TabContent>
          )
        })
      }

    </TabsWrapper>
  );
};

export default connect(({ popup }) => ({
  popup,
}))(Popup);