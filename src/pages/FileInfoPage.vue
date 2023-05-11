<template>
  <el-container style="height: 96%;width: 99%" class="is-vertical shadow-container">
    <el-dialog
        style="border-radius: 10px"
        title="保存到："
        :visible.sync="dialogTableVisible"
        width="40%"
        height="350"
        top="50px"
    >
      <el-container>
        <el-header>
          <el-button
              type="primary"
              size="mini"
              icon="el-icon-arrow-left"
              @click="last"
              style="float: left; margin-top: 10px;"
              :disabled="userPath[index] === '/'"
          >上一级</el-button
          >
        </el-header>
        <el-main>
          <el-table
              :data="userFolderList"
              height="300"
              @row-click="savePath"
              style="margin-top: -35px;overflow-x: hidden;"
          >

            <el-table-column
                property="fileName"
                label="文件夹"
                width="475%"
                style="height: 15px"
                align="left"
                :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <!--阻止事件冒泡-->
                <el-link
                    type="primary"
                    :underline="false"
                    @click.stop="savePath(scope.row)"
                >
                  <el-image
                      style="width: 30px; height: 30px;position:absolute; bottom: -2px"
                      :src="require('../assets/icon/folder.png')"
                  >
                  </el-image>
                  <span>
                      &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{{ scope.row.f_name }}
                    </span>
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-button type="warning" @click="dialogTableVisible = false;handleSave(fileInfo);">确定</el-button>
        </el-footer>
      </el-container>
    </el-dialog>
    <el-header height="60px" style="text-align: right; font-size: 12px;width: 100%; margin-top: 20px">
      <div style="vertical-align: auto">
        <router-link to="/user/fileSquare">
          <el-page-header content="文件广场" style="color: #66b1ff">
          </el-page-header>
        </router-link>
        <el-button type="primary" size="small" style="margin-left: 150px;" @click="dialogTableVisible = true;userPath = '/';getUserFolderList()">保存到网盘</el-button>
      </div>
      <div style="margin-top: 10px">
        <div style="float:left;">
          <div style="display: inline-block;">
            <el-image
                style="border-radius: 10px"
                class="preview-image"
                :src="fileInfo.preview_url"
                ></el-image>
          </div>
        </div>
        <div style="margin-left: 30px;margin-top: 18px; font-size: 20px;color: gray;display: inline-block;float: left">
          <el-tag style="margin-left: 50px;margin-top: -50px" type="success"><span>文件名：{{fileInfo.n_name}}</span></el-tag>
          <el-tag style="margin-left: 50px;margin-top: -50px"><span>文件大小：{{changeFileSize(fileInfo.f_size)}}</span></el-tag>
          <el-tag style="margin-left: 50px;margin-top: -50px"><span>下载次数：{{fileInfo.hot}}</span></el-tag>

        </div>
      </div>
      <div style="margin-top: 40px">
        <div style="font-size: 16px; margin-right: 10px;display: inline-block"><strong>资源评分：</strong></div>
        <div style="display: inline-block">
          <el-rate
              style="height: 50px;"
              v-bind:value="parseFloat(fileInfo.score)"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}">
            软件评分：
          </el-rate>
        </div>
      </div>
    </el-header>
    <el-main style="margin-top: 80px; height: 50%;">
      <div>
        <div style="font-size: 18px; margin-top: 15px;height: 100%">
          <strong>资源介绍：</strong>
          <div class="highlight-box">
            <p style="text-indent: 2em;text-align:left;line-height:35px;font-size: 16px;white-space: pre-wrap;font-weight: 500" v-for="(paragraph, index) in formattedText" :key="index" v-html="paragraph"></p>
<!--            <p style="text-indent: 2em;text-align:left;line-height:35px;font-size: 16px;white-space: pre-wrap;">{{fileInfo.f_description}}</p>-->
          </div>
          <div class="highlight-box" style="height: 80px">
            给出你的评分：
            <el-rate
                style="margin-top: 7px;display: inline-block"
                v-model="score"
                show-text
                @change="mark"
                text-color="#ff9900"
                score-template="{value}">
            </el-rate>
            <div style="display: inline-block; margin-left: 40px;float:right;">
              <el-tag>标签一</el-tag>
              <el-tag type="success">标签二</el-tag>
              <el-tag type="info">标签三</el-tag>
              <el-tag type="warning">标签四</el-tag>
              <el-tag type="danger">标签五</el-tag>
            </div>
          </div>

          <div v-clickoutside="hideReplyBtn" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2); border-radius: 15px;">
            <div @click="inputFocus" class="my-reply" style="margin-top: 10px;border-radius: 15px;">
              <el-avatar class="header-img" :size="40" :src="userInfo.avatar_url?userInfo.avatar_url:require('../assets/default_avatar.jpg')"></el-avatar>
              <div class="reply-info" >
                <div
                    id="reply-input"
                    tabindex="0"
                    contenteditable="true"
                    spellcheck="false"
                    placeholder="资源好不好？留下你的评论..."
                    class="reply-input"
                    @focus="showReplyBtn"
                    @input="onDivInput($event)"
                >
                </div>

              </div>
              <div>
                <div class="reply-btn-box" style="display: inline-block;" v-show="btnShow">
                </div>
                <el-button icon="el-icon-s-promotion" style="display: inline-block;float:right; margin-top: -40px" class="reply-btn" size="medium" @click="sendComment" type="primary">发表评论</el-button>
              </div>
            </div>
            <div style="overflow: auto;height: 15%">
              <div v-for="(item,i) in comments" :key="i" class="author-title reply-father">
                <el-avatar class="header-img" :size="40" :src="item.avatar_url?item.avatar_url:require('../assets/default_avatar.jpg')"></el-avatar>
                <div class="author-info">
                  <span class="author-name">{{item.nike_name}}
<!--                    <el-tag v-if="userInfo.type === 1 && item.uid === userInfo.uid" size="small" type="success" style="margin-left: 15px;padding-top: -10px">管理员</el-tag>-->
                  </span>
                  <span class="author-time">{{timeAgo(item.comment_date)}}</span>
                </div>
                <div class="icon-btn">
                  <span @click="showReplyInput(i, -1)">
                    <el-tooltip class="item" effect="dark" content="回复" placement="top">
                      <i class="el-icon-chat-dot-square"></i>
                    </el-tooltip>
                    {{item.reply_num}}
                  </span>
                  <span style="margin-left: 100px" @click="starComment(i, -1)">
                        <svg v-if="!item._star" t="1683258516255" class="icon" viewBox="0 0 1071 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9868" width="15" height="15"><path d="M1041.441824 418.173769C1017.545784 379.457987 976.978907 357.655147 934.856203 355.990951 932.672662 355.651924 930.455865 355.426732 928.182457 355.426732L681.491077 355.156994C698.221007 307.082112 707.361417 255.423948 707.361417 201.600472 707.361417 166.693164 703.416492 132.726219 696.177769 100.007732L695.526642 100.09187C682.3613 42.777911 631.382524 0 570.359886 0 499.341382 0 441.78117 57.86828 441.78117 129.246872 441.78117 133.195164 442.028573 137.076641 442.364598 140.942034 438.548914 278.142407 331.614976 389.360269 196.661604 399.069528L196.661604 399.904721 49.99039 400.248696C48.21671 400.029691 46.431955 399.882449 44.609042 399.882449 20.192356 399.882449 0.39757 419.774863 0.39757 444.313419L0 977.678089C0 1002.211696 19.782477 1022.104111 44.199165 1022.104111 46.59566 1022.104111 48.930613 1021.861596 51.223717 1021.494111L214.393457 1021.562164C216.553627 1021.888817 218.732259 1022.104111 220.969974 1022.104111 223.210149 1022.104111 225.381396 1021.888817 227.525566 1021.56835L840.966989 1021.82695 840.966989 1022.092974C864.997185 1022.137518 889.32402 1015.639107 911.109115 1001.722954 931.788904 988.498463 947.345814 970.345723 957.569383 949.811138 960.374515 945.715604 962.586401 941.106583 963.928028 936.029854L1059.429687 512.279478C1060.754092 507.254717 1061.113516 502.206443 1060.720858 497.29428 1062.705021 470.461729 1056.644245 442.797699 1041.441824 418.173769L1041.441824 418.173769ZM265.44116 938.490887 177.048986 938.469853 177.38132 494.580834C177.38132 494.580834 231.384331 494.238097 265.862117 483.495673L265.44116 938.490887 265.44116 938.490887Z" fill="#2c2c2c" p-id="9869"></path>
                        </svg>
                        <svg v-else t="1683258516255" class="icon" viewBox="0 0 1071 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9868" width="15" height="15"><path d="M1041.441824 418.173769C1017.545784 379.457987 976.978907 357.655147 934.856203 355.990951 932.672662 355.651924 930.455865 355.426732 928.182457 355.426732L681.491077 355.156994C698.221007 307.082112 707.361417 255.423948 707.361417 201.600472 707.361417 166.693164 703.416492 132.726219 696.177769 100.007732L695.526642 100.09187C682.3613 42.777911 631.382524 0 570.359886 0 499.341382 0 441.78117 57.86828 441.78117 129.246872 441.78117 133.195164 442.028573 137.076641 442.364598 140.942034 438.548914 278.142407 331.614976 389.360269 196.661604 399.069528L196.661604 399.904721 49.99039 400.248696C48.21671 400.029691 46.431955 399.882449 44.609042 399.882449 20.192356 399.882449 0.39757 419.774863 0.39757 444.313419L0 977.678089C0 1002.211696 19.782477 1022.104111 44.199165 1022.104111 46.59566 1022.104111 48.930613 1021.861596 51.223717 1021.494111L214.393457 1021.562164C216.553627 1021.888817 218.732259 1022.104111 220.969974 1022.104111 223.210149 1022.104111 225.381396 1021.888817 227.525566 1021.56835L840.966989 1021.82695 840.966989 1022.092974C864.997185 1022.137518 889.32402 1015.639107 911.109115 1001.722954 931.788904 988.498463 947.345814 970.345723 957.569383 949.811138 960.374515 945.715604 962.586401 941.106583 963.928028 936.029854L1059.429687 512.279478C1060.754092 507.254717 1061.113516 502.206443 1060.720858 497.29428 1062.705021 470.461729 1056.644245 442.797699 1041.441824 418.173769L1041.441824 418.173769ZM265.44116 938.490887 177.048986 938.469853 177.38132 494.580834C177.38132 494.580834 231.384331 494.238097 265.862117 483.495673L265.44116 938.490887 265.44116 938.490887Z" fill="#1296db" p-id="9869"></path>
                        </svg>
                    {{item.star}}
                  </span>
                  <span style="margin-left: 50px;">
                    <el-tooltip v-if="item.replyShow" class="item" effect="dark" content="隐藏回复" placement="top">
                      <i @click="hiddenReply(i)" class="el-icon-caret-bottom">
                      </i>
                    </el-tooltip>
                    <el-tooltip v-else  class="item" effect="dark" content="显示回复" placement="top">
                      <i @click="showReply(i)" class="el-icon-caret-top"></i>
                    </el-tooltip>
                  </span>
                  <span style="margin-left: 100px;" @click="deleteComment(item.cid)">
                    <el-tooltip v-if="item.uid === userInfo.uid" class="item" effect="dark" content="删除评论" placement="top">
                        <svg t="1683380583715" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2409" width="15" height="15"><path d="M519.620465 0c-103.924093 0-188.511256 82.467721-192.083349 185.820279H85.015814A48.91386 48.91386 0 0 0 36.101953 234.686512a48.91386 48.91386 0 0 0 48.913861 48.866232h54.010046V831.345116c0 102.852465 69.822512 186.844279 155.909954 186.844279h439.200744c86.087442 0 155.909953-83.491721 155.909954-186.844279V284.100465h48.91386a48.91386 48.91386 0 0 0 48.913861-48.890046 48.91386 48.91386 0 0 0-48.913861-48.866233h-227.756651A191.559442 191.559442 0 0 0 519.620465 0z m-107.234232 177.080558c3.548279-49.771163 46.627721-88.540279 99.851907-88.540279 53.224186 0 96.327442 38.745302 99.351813 88.540279h-199.20372z m-111.997024 752.044651c-30.981953 0-65.083535-39.15014-65.083535-95.041488V287.744h575.488v546.839814c0 55.915163-34.077767 95.041488-65.059721 95.041488H300.389209v-0.500093z" fill="#D81E06" p-id="2410"></path><path d="M368.116093 796.814884c24.361674 0 44.27014-21.670698 44.27014-48.818605v-278.623256c0-27.147907-19.908465-48.818605-44.27014-48.818604-24.33786 0-44.27014 21.670698-44.27014 48.818604v278.623256c0 27.147907 19.360744 48.818605 44.293954 48.818605z m154.933581 0c24.361674 0 44.293953-21.670698 44.293954-48.818605v-278.623256c0-27.147907-19.932279-48.818605-44.293954-48.818604-24.33786 0-44.27014 21.670698-44.270139 48.818604v278.623256c0 27.147907 19.932279 48.818605 44.293953 48.818605z m132.810419 0c24.33786 0 44.27014-21.670698 44.27014-48.818605v-278.623256c0-27.147907-19.932279-48.818605-44.27014-48.818604s-44.27014 21.670698-44.27014 48.818604v278.623256c0 27.147907 19.360744 48.818605 44.27014 48.818605z" fill="#D81E06" p-id="2411"></path>
                        </svg>
                    </el-tooltip>
                  </span>
                </div>
                <div class="talk-box">
                  <p>
                    <span class="reply">{{item.content}}</span>
                  </p>
                </div>
                <div  v-show="_inputShow(i)" class="my-reply my-comment-reply">
                  <el-avatar class="header-img" :size="40" :src="userInfo.avatar_url?userInfo.avatar_url:require('../assets/default_avatar.jpg')"></el-avatar>
                  <div class="reply-info">
<!--                    <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="输入评论..."   @input="onDivInput($event)"  class="reply-input reply-comment-input"></div>-->
                    <el-input tabindex="0" contenteditable="true" spellcheck="false" placeholder="资源好不好？留下你的评论..." class="reply-input reply-comment-input" v-model="replyComment">
                      <template slot="prepend">回复给: {{reply_nike_name}}</template>
<!--                      ? item.nike_name : item.replies[reply_to].nike_name}}-->
                    </el-input>
                  </div>
                  <div class=" reply-btn-box">
                    <el-button icon="el-icon-s-promotion" style="display: inline-block;float:right; margin-top: -57px; margin-right: -10px" class="reply-btn" size="medium" @click="sendCommentReply(i, reply_to)" type="primary">发表评论</el-button>
<!--                    <el-button class="reply-btn" size="medium" @click="sendCommentReply(i, reply_to)" type="primary">发表评论</el-button>-->
                  </div>
                </div>
                <div v-show="item.replyShow" class="reply-box">
                  <div v-for="(reply,j) in item.replies" :key="j" class="author-title">
                    <el-avatar class="header-img" :size="40" :src="reply.avatar_url?reply.avatar_url:require('../assets/default_avatar.jpg')"></el-avatar>
                    <div class="author-info">
                      <span class="author-name">{{reply.nike_name}}</span>
                      <span class="author-time">{{timeAgo(reply.comment_date)}}</span>
                    </div>
                    <div class="icon-btn">
                      <span @click="showReplyInput(i, j)">
                        <el-tooltip class="item" effect="dark" content="回复" placement="top">
                          <i class="el-icon-chat-dot-square"></i>
                        </el-tooltip>
                      </span>
                      <span style="margin-left: 100px" @click="starComment(i, j)">
                        <svg v-if="!reply._star" t="1683258516255" class="icon" viewBox="0 0 1071 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9868" width="15" height="15"><path d="M1041.441824 418.173769C1017.545784 379.457987 976.978907 357.655147 934.856203 355.990951 932.672662 355.651924 930.455865 355.426732 928.182457 355.426732L681.491077 355.156994C698.221007 307.082112 707.361417 255.423948 707.361417 201.600472 707.361417 166.693164 703.416492 132.726219 696.177769 100.007732L695.526642 100.09187C682.3613 42.777911 631.382524 0 570.359886 0 499.341382 0 441.78117 57.86828 441.78117 129.246872 441.78117 133.195164 442.028573 137.076641 442.364598 140.942034 438.548914 278.142407 331.614976 389.360269 196.661604 399.069528L196.661604 399.904721 49.99039 400.248696C48.21671 400.029691 46.431955 399.882449 44.609042 399.882449 20.192356 399.882449 0.39757 419.774863 0.39757 444.313419L0 977.678089C0 1002.211696 19.782477 1022.104111 44.199165 1022.104111 46.59566 1022.104111 48.930613 1021.861596 51.223717 1021.494111L214.393457 1021.562164C216.553627 1021.888817 218.732259 1022.104111 220.969974 1022.104111 223.210149 1022.104111 225.381396 1021.888817 227.525566 1021.56835L840.966989 1021.82695 840.966989 1022.092974C864.997185 1022.137518 889.32402 1015.639107 911.109115 1001.722954 931.788904 988.498463 947.345814 970.345723 957.569383 949.811138 960.374515 945.715604 962.586401 941.106583 963.928028 936.029854L1059.429687 512.279478C1060.754092 507.254717 1061.113516 502.206443 1060.720858 497.29428 1062.705021 470.461729 1056.644245 442.797699 1041.441824 418.173769L1041.441824 418.173769ZM265.44116 938.490887 177.048986 938.469853 177.38132 494.580834C177.38132 494.580834 231.384331 494.238097 265.862117 483.495673L265.44116 938.490887 265.44116 938.490887Z" fill="#2c2c2c" p-id="9869"></path>
                        </svg>
                        <svg v-else t="1683258516255" class="icon" viewBox="0 0 1071 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9868" width="15" height="15"><path d="M1041.441824 418.173769C1017.545784 379.457987 976.978907 357.655147 934.856203 355.990951 932.672662 355.651924 930.455865 355.426732 928.182457 355.426732L681.491077 355.156994C698.221007 307.082112 707.361417 255.423948 707.361417 201.600472 707.361417 166.693164 703.416492 132.726219 696.177769 100.007732L695.526642 100.09187C682.3613 42.777911 631.382524 0 570.359886 0 499.341382 0 441.78117 57.86828 441.78117 129.246872 441.78117 133.195164 442.028573 137.076641 442.364598 140.942034 438.548914 278.142407 331.614976 389.360269 196.661604 399.069528L196.661604 399.904721 49.99039 400.248696C48.21671 400.029691 46.431955 399.882449 44.609042 399.882449 20.192356 399.882449 0.39757 419.774863 0.39757 444.313419L0 977.678089C0 1002.211696 19.782477 1022.104111 44.199165 1022.104111 46.59566 1022.104111 48.930613 1021.861596 51.223717 1021.494111L214.393457 1021.562164C216.553627 1021.888817 218.732259 1022.104111 220.969974 1022.104111 223.210149 1022.104111 225.381396 1021.888817 227.525566 1021.56835L840.966989 1021.82695 840.966989 1022.092974C864.997185 1022.137518 889.32402 1015.639107 911.109115 1001.722954 931.788904 988.498463 947.345814 970.345723 957.569383 949.811138 960.374515 945.715604 962.586401 941.106583 963.928028 936.029854L1059.429687 512.279478C1060.754092 507.254717 1061.113516 502.206443 1060.720858 497.29428 1062.705021 470.461729 1056.644245 442.797699 1041.441824 418.173769L1041.441824 418.173769ZM265.44116 938.490887 177.048986 938.469853 177.38132 494.580834C177.38132 494.580834 231.384331 494.238097 265.862117 483.495673L265.44116 938.490887 265.44116 938.490887Z" fill="#1296db" p-id="9869"></path>
                        </svg>
                        {{reply.star}}
                      </span>
                      <span style="margin-left: 100px;" @click="deleteComment(reply.cid)">
                        <el-tooltip v-if="reply.uid === userInfo.uid" class="item" effect="dark" content="删除评论" placement="top">
                          <svg t="1683380583715" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2409" width="15" height="15"><path d="M519.620465 0c-103.924093 0-188.511256 82.467721-192.083349 185.820279H85.015814A48.91386 48.91386 0 0 0 36.101953 234.686512a48.91386 48.91386 0 0 0 48.913861 48.866232h54.010046V831.345116c0 102.852465 69.822512 186.844279 155.909954 186.844279h439.200744c86.087442 0 155.909953-83.491721 155.909954-186.844279V284.100465h48.91386a48.91386 48.91386 0 0 0 48.913861-48.890046 48.91386 48.91386 0 0 0-48.913861-48.866233h-227.756651A191.559442 191.559442 0 0 0 519.620465 0z m-107.234232 177.080558c3.548279-49.771163 46.627721-88.540279 99.851907-88.540279 53.224186 0 96.327442 38.745302 99.351813 88.540279h-199.20372z m-111.997024 752.044651c-30.981953 0-65.083535-39.15014-65.083535-95.041488V287.744h575.488v546.839814c0 55.915163-34.077767 95.041488-65.059721 95.041488H300.389209v-0.500093z" fill="#D81E06" p-id="2410"></path><path d="M368.116093 796.814884c24.361674 0 44.27014-21.670698 44.27014-48.818605v-278.623256c0-27.147907-19.908465-48.818605-44.27014-48.818604-24.33786 0-44.27014 21.670698-44.27014 48.818604v278.623256c0 27.147907 19.360744 48.818605 44.293954 48.818605z m154.933581 0c24.361674 0 44.293953-21.670698 44.293954-48.818605v-278.623256c0-27.147907-19.932279-48.818605-44.293954-48.818604-24.33786 0-44.27014 21.670698-44.270139 48.818604v278.623256c0 27.147907 19.932279 48.818605 44.293953 48.818605z m132.810419 0c24.33786 0 44.27014-21.670698 44.27014-48.818605v-278.623256c0-27.147907-19.932279-48.818605-44.27014-48.818604s-44.27014 21.670698-44.27014 48.818604v278.623256c0 27.147907 19.360744 48.818605 44.27014 48.818605z" fill="#D81E06" p-id="2411"></path>
                          </svg>
                        </el-tooltip>
                      </span>
                    </div>
                    <div class="talk-box">
                      <p>
                        <span>回复 {{reply.reply_nike_name}}:</span>
                        <span class="reply">{{reply.content}}</span>
                      </p>
                    </div>
                    <div class="reply-box">

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </el-main>
  </el-container>

</template>

<script>

const clickoutside = {
  // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {},
  unbind(el, binding) {
    // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside);
    delete el.vueClickOutside;
  },
};
export default {
  name: "FileInfoPage",
  data(){
    return{
      fid: this.$route.params.fid,
      fileInfo: {},
      score: 0.0,
      avgScore: 0.0,
      userInfo: {},
      btnShow: false,
      index: '0',
      replyComment:'',
      comments: [],
      reply_to: -1,
      reply_nike_name: '',


      dialogTableVisible: false,
      // 用户当前要保存到的路径
      userPath: '/',
      userPathStack: ['/'],
      folderIndex: 0,
      userFolderList: [],
    }

  },
  directives: {clickoutside},
  methods:{
    timeAgo(formatDate) {
      const ONE_MINUTE = 60 * 1000; // 1分钟
      const ONE_HOUR = 60 * ONE_MINUTE; // 1小时
      const ONE_DAY = 24 * ONE_HOUR; // 1天

      // 将时间字符串转换为时间戳
      const targetTime = new Date(formatDate).getTime();

      // 获取当前时间戳
      const now = new Date().getTime();

      // 计算时间差
      const diff = now - targetTime;

      if (diff < ONE_MINUTE) {
        return '刚刚';
      } else if (diff < ONE_HOUR) {
        return Math.floor(diff / ONE_MINUTE) + '分钟前';
      } else if (diff < ONE_DAY) {
        return Math.floor(diff / ONE_HOUR) + '小时前';
      } else {
        // 超过一天，直接显示时间本身
        return formatDate;
      }
    },
    changeFileSize(f_size) {
      var fileSizeByte = f_size;
      var fileSizeMsg = "";
      if (fileSizeByte > 0 && fileSizeByte < 1048576)
        fileSizeMsg = (fileSizeByte / 1024).toFixed(1) + "KB";
      else if (fileSizeByte == 1048576) fileSizeMsg = "1MB";
      else if (fileSizeByte > 1048576 && fileSizeByte < 1073741824)
        fileSizeMsg = (fileSizeByte / (1024 * 1024)).toFixed(1) + "MB";
      else if (fileSizeByte > 1048576 && fileSizeByte == 1073741824)
        fileSizeMsg = "1GB";
      else if (fileSizeByte > 1073741824 && fileSizeByte < 1099511627776)
        fileSizeMsg = (fileSizeByte / (1024 * 1024 * 1024)).toFixed(1) + "GB";
      else fileSizeMsg = "-";
      return fileSizeMsg;
    },
    getMark(){
      this.$http({
        method: 'POST',
        url: '/user/getMark',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          fid: this.fid,
        }
      }).then(res=>{
        if(res.status === 200){
          this.score = res.data.data;
          this.getPublicFileInfo();
        }
      })
    },
    mark(value){
      this.$http({
        method: 'POST',
        url: '/user/mark',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          fid: this.fid,
          score: value
        }
      }).then(res=>{
        if(res.status === 200){
          this.getMark();
        }
      })
    },
    inputFocus(){
      this.hideReplyBtn()
      var replyInput = document.getElementById('reply-input');
      replyInput.style.padding = "8px 8px"
      replyInput.style.border = "2px solid blue"
      this.reply_to = -1;
      replyInput.focus()
    },
    showReplyBtn(){
      this.btnShow = true
    },
    hideReplyBtn(){
      this.btnShow = false
      var replyInputs = document.getElementsByClassName('reply-input');
      for (let i = 0; i < replyInputs.length; i++) {
        replyInputs[i].style.padding= "10px"
        replyInputs[i].style.border ="none"
      }
      this.comments[this.index].inputShow = false
    },
    showReplyInput(i, j){
      this.comments[this.index].inputShow = false
      this.comments[this.index].replyShow = false
      this.index = i
      this.comments[i].inputShow = true;
      this.comments[i].replyShow = true;
      this.reply_to = j;
      if(j === -1) this.reply_nike_name = this.comments[i].nike_name;
      else this.reply_nike_name = this.comments[i].replies[j].nike_name;

    },
    hiddenReply(i){
      this.comments[i].replyShow = false;
    },
    showReply(i){
      this.comments[i].replyShow = true;
    },
    _inputShow(i){
      return this.comments[i].inputShow
    },
    starComment(i, j){
      this.$http({
        method: 'POST',
        url: '/user/starComment',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {cid: j === -1 ? this.comments[i].cid : this.comments[i].replies[j].cid}
      }).then(res=>{
        if(res.status === 200) {
          this.getComment();
          this.replyComment = ''
        }
      })
    },
    sendComment(){
      if(!this.replyComment){
        this.$message({
          showClose: true,
          type:'warning',
          message:'评论不能为空'
        })
      }else{
        let content = document.getElementById('replyInput');
        let comment = {
          fid: this.fid,
          reply_to: -1,
          content: this.replyComment,
          star: 0,
          reply_num: 0
        }
        this.$http({
          method: 'POST',
          url: '/user/comment',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: comment
        }).then(res=>{
          if(res.status === 200) {
            this.getComment();
            this.replyComment = ''
            content.innerHTML = '';
          }
        })

        // let a ={}
        // let input =  document.getElementById('replyInput')
        // let timeNow = new Date().getTime();
        // let time= this.dateStr(timeNow);
        // a.name= this.myName
        // a.comment =this.replyComment
        // a.headImg = this.myHeader
        // a.time = time
        // a.commentNum = 0
        // a.like = 0
        // this.comments.push(a)

      }
    },
    sendCommentReply(i, j){
      if(!this.replyComment){
        this.$message({
          showClose: true,
          type:'warning',
          message:'评论不能为空'
        })
      }else{
        console.log(j, this.comments[i].replies)
        let comment = {
          fid: this.fid,
          belong_to: this.comments[i].cid,
          reply_to: j === -1 ? this.comments[i].uid : this.comments[i].replies[j].uid,
          content: this.replyComment,
          star: 0,
          reply_num: 0
        }
        this.$http({
          method: 'POST',
          url: '/user/reply',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data: comment
        }).then(res=>{
          if(res.status === 200 && res.data.msg === 'replySuccess'){
            this.getComment();
            this.replyComment = ''
            document.getElementsByClassName("reply-comment-input")[i].innerHTML = ""
          }
        })


        // let a ={}
        // let timeNow = new Date().getTime();
        // let time= this.dateStr(timeNow);
        // a.from= this.myName
        // a.to = this.to
        // a.fromHeadImg = this.myHeader
        // a.comment =this.replyComment
        // a.time = time
        // a.commentNum = 0
        // a.like = 0
        // this.comments[i].reply.push(a)
        // this.replyComment = ''
        // document.getElementsByClassName("reply-comment-input")[i].innerHTML = ""
      }
    },
    deleteComment(cid){
      this.$http({
        method: 'POST',
        url: '/user/deleteComment',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {cid: cid}
      }).then(res=>{
        if(res.status === 200){
          this.getComment();
        }
      })
    },
    onDivInput(e) {
      console.log(typeof e === typeof "string",typeof e, e)
      this.replyComment = e.target.innerHTML;
    },
    onElInput(e){
      console.log(e)
    },
    getComment(){
      this.$http({
        method: "POST",
        headers:{
          "Content-Type": "multipart/form-data"
        },
        url: "/user/getComment",
        data:{ fid: this.fid}
      }).then((res)=>{
        if(res.status === 200 && res.data.data){
          this.comments = res.data.data;
          this.comments.forEach(item=>{
            this.$set(item, 'inputShow', false);
            this.$set(item, 'replyShow', false);
          })
        }
        else{
          this.$message({
            type: "error",
            message: "未知错误！",
          })
        }
      })
    },
    getPublicFileInfo(){
      this.$http({
        method: "POST",
        headers:{
          "Content-Type": "multipart/form-data"
        },
        url: "/public/getPublicFileInfo",
        data:{ fid: this.fid}
      }).then((res)=>{
        if(res.status === 200 && res.data.data){
          this.fileInfo = res.data.data;
          this.fileInfo.score = this.fileInfo.score.toFixed(1)

        }
        else{
          this.$message({
            type: "error",
            message: "未知错误！",
          })
        }
      })
    },
    getUserInfo(){
      this.$http({
        method: "GET",
        url: "/user/getUserInfo",
      }).then((res)=>{
        if(res.status === 200){
          if(res.data.msg === 'getUserInfoSuccess'){
            this.userInfo = res.data.data;
          }
        }
      })
    },
    handleSave(publicFileInfo){
      this.$http({
        method: "POST",
        headers:{
          "Content-Type": "multipart/form-data"
        },
        url: "/public/savePublicFile",
        data:{
          savePath: this.userPath,
          fid: publicFileInfo.fid,
          publicFileInfo: publicFileInfo,
        },
      }).then((res)=>{
        if(res.status === 200 && res.data.status === 200){
          this.$message.success('已保存！');
        }
        else if(res.data.msg === "fileNameRepetitive"){
          this.$message.warning('已有重名文件！')
        }
        else{
          this.$message({
            type: "error",
            message: "未知错误！",
          })
        }
      })
    },
    getUserFolderList(){
      this.$http({
        method: "POST",
        headers:{
          "Content-Type": "multipart/form-data"
        },
        url: "/user/getUserFolderList",
        data:{ savePath: this.userPath },
      }).then((res)=>{
        if(res.status === 200 && res.data.data){
          this.userFolderList = res.data.data;
        }
        else{
          this.$message({
            type: "error",
            message: "未知错误！",
          })
        }
      })
    },
    // 选择提取路径
    savePath(rowData){
      this.$http({
        method: "POST",
        headers:{
          "Content-Type": "multipart/form-data"
        },
        url: "/user/toFolder",
        data:{ savePath: this.userPath + rowData.f_name + "/" },
      }).then((res)=>{
        if(res.data.status === 200){
          // 更新用戶路徑
          this.userPath = this.userPath + rowData.f_name + "/";
          this.userPathStack.push(this.userPath);
          this.folderIndex += 1;
          // 更新文件夹列表
          this.getUserFolderList();
        }
        else{
          this.$message({
            type: "error",
            message: "未知错误！",
          })
        }
      })
    },
    last(){
      this.userPath = this.userPathStack[this.folderIndex - 1];
      this.folderIndex -= 1;
      this.userPathStack.pop();
      this.getUserFolderList();
    },
  },
  computed:{
    formattedText(){
      return this.fileInfo.f_description.split("\n").map(
          (paragraph) => `<span class="indent">${paragraph}</span>`
      );
    }
  },
  mounted() {
    this.getPublicFileInfo();
    this.getComment();
    this.getUserInfo();
    this.getMark();
    console.log(this)
  },
}
</script>

<style scoped>
/deep/ .el-rate__icon{
  font-size: 20px;
}
.router-link-active {
  text-decoration: none;
}
a {
  text-decoration: none;
  color: black;
}
.shadow-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  height: 540px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 5px;
}
.preview-image{
  height: 60px;
  width: 60px;
}
.highlight-box {
  background-color: #f7f7f7;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
  box-shadow: 0 0 5px #ccc;
  height: 150px;
  overflow: auto; /* 添加滚动条 */
}

.highlight-box p {
  margin: 0;
  font-weight: bold;
  color: #333;
  text-align: center;
}

.el-tag{
  margin-left: 5px;
  margin-right: 5px;
}

</style>
<style lang="stylus" scoped>
.my-reply
  padding 10px
  background-color #fafbfc
  .header-img
    display inline-block
    vertical-align top
  .reply-info
    display inline-block
    margin-left 5px
    width 90%
    @media screen and (max-width:1200px) {
      width 80%
    }
    .reply-input
      min-height 20px
      line-height 22px
      padding 10px 10px
      color #ccc
      background-color #fff
      border-radius 5px
      width 95%
      &:empty:before
        content attr(placeholder)
      &:focus:before
        content none
      &:focus
        padding 8px 8px
        border 2px solid blue
        box-shadow none
        outline none
  .reply-btn-box
    height 25px
    margin 10px 0
    .reply-btn
      position relative
      float right
      margin-right 15px
.my-comment-reply
  margin-left 50px
  .reply-input
    width flex
.author-title:not(:last-child)
  border-bottom: 1px solid rgba(178,186,194,.3)
.author-title
  padding 10px
  .header-img
    display inline-block
    vertical-align top
  .author-info
    display inline-block
    margin-left 5px
    width 60%
    height 40px
    line-height 20px
    >span
      display block
      cursor pointer
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    .author-name
      color #000
      font-size 18px
      font-weight bold
    .author-time
      font-size 14px
  .icon-btn
    width 30%
    padding 0 !important
    float right
    @media screen and (max-width : 1200px){
      width 20%
      padding 7px
    }
    >span
      cursor pointer
    .iconfont
      margin 0 5px
  .talk-box
    margin 0 50px
    >p
      margin 0
    .reply
      font-size 16px
      color #000
  .reply-box
    margin 10px 0 0 50px
    background-color #efefef
</style>