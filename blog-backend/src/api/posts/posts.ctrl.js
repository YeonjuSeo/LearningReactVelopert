// 컨트롤러: 라우트 처리 함수만 모아 놓은 파일

let postId = 1; //id의 초깃값

//post 배열 초기 데이터
const posts = [
  {
    id: 1,
    title: '제목',
    body: '내용',
  },
];

// 포스트 작성
// POST /api/posts
// {title, body}
exports.write = (ctx) => {
  // REST API의 Request Body는 ctx.request.body에서 조회 가능
  const { title, body } = ctx.request.body;
  postId += 1; //기존 postId 값에 1씩 더하기
  const post = { id: postId, title, body };
  posts.push(post);
  ctx.body = post;
};

// 포스트 목록 조회
// GET /api/posts
exports.list = (ctx) => {
  ctx.body = posts;
};

// 특정 포스트 조회
// GET /api/posts/:id
exports.read = (ctx) => {
  const { id } = ctx.params;
  // 주어진 id 값으로 포스트 탐색
  // 파라미터로 받아온 값은 문자열 형식이므로
  // 파라미터를 숫자로 변환하기 or 비교할 p.id 값을 문자열로 변경하기
  const post = posts.find((p) => p.id.toString() === id);
  // 포스트가 없으면 오류 반환
  if (!post) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  ctx.body = post;
};

// 특정 포스트 제거
// DELETE /api/posts/:id
exports.remove = (ctx) => {
  const { id } = ctx.params;
  //   해당 id를 가진 post가 몇번째 post인지 확인
  const index = posts.findIndex((p) => p.id.toString() === id);
  // 포스트가 없으면 오류 반환
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  // index번째 포스트 제거
  posts.splice(index, 1);
  ctx.status = 204; //No Content
};

// 포스트 수정(교체)
// PUT /api/posts/:id
// {title, body}
exports.replace = (ctx) => {
  // PUT 메서드는 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때 사용
  const { id } = ctx.params;
  // 해당 id를 가진 post가 몇번째 인지 확인
  const index = posts.findIndex((p) => p.id.toString() === id);
  // 포스트가 없으면 오류 반환
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  //   전체 객체를 덮어 씌우기 위해
  // id를 제외한 기존 정보를 없애고 객체를 새로 만들기
  posts[index] = {
    id,
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};

// 포스트 수정(특정 필드 변경)
// PATCH /api/posts/:id
// {title, body}
exports.update = (ctx) => {
  // PATCH 메서드는 주어진 필드만 교체한다.
  const { id } = ctx.params;
  // 해당 id를 가진 post가 몇번째인지 확인
  const index = posts.findIndex((p) => p.id.toString() === id);
  // 포스트가 없으면 오류 반환
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.',
    };
    return;
  }
  //   기존 값에 정보 덮어 씌우기
  posts[index] = {
    ...posts[index],
    ...ctx.request.body,
  };
  ctx.body = posts[index];
};
