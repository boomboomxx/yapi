######## 构建 ########
FROM --platform=${BUILDPLATFORM:-amd64} node:10.24.1-alpine as builder

# 安装构建工具
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories\
  && apk add --update --no-cache build-base git bash 

# YApi 版本
ENV YAPI_VERSION=master

# 编译脚本
WORKDIR /yapi/scripts
COPY . .
RUN yarn config set registry https://registry.npmmirror.com\
  && yarn config set ignore-engines true\
  && yarn && yarn build

WORKDIR /yapi/vendors

# 拉取 YApi 源码
RUN git clone \
  --branch "${YAPI_VERSION}" \
  --single-branch \
  --depth 1 \
  http://xux%40jx-sz.net:xx1234@git.szistech.com/devops/yapi.git .\
  && cp /yapi/scripts/start.js ./start.js \
  && node /yapi/scripts/prepare.js $(pwd)\
  && yarn \
  && node /yapi/scripts/clean.js $(pwd) \
  && yarn install --production \
  && node /yapi/scripts/clean.js $(pwd) \
  && rm -rf /yapi/scripts

######## 镜像 ########
FROM node:10.24.1-alpine

WORKDIR /yapi

COPY --from=builder /yapi .

EXPOSE 3000

CMD ["node", "/yapi/vendors/start.js"]
