const tagRouter = {
  route: null,
  name: null,
  title: '标签管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-s-goods',
  filePath: 'view/tag/', // 文件路径
  order: 2,
  inNav: true,
  children: [
    {
      title: '标签列表',
      type: 'view',
      name: 'tags',
      route: '/tag/list',
      filePath: 'view/tag/tag-list.vue',
      inNav: true,
      icon: 'el-icon-s-goods',
    },
    {
      title: '标签添加',
      type: 'view',
      name: 'TagCreate',
      route: '/tag/add',
      filePath: 'view/tag/tag-create.vue',
      inNav: true,
      icon: 'iconfont icon-add',
    },
  ],
}

export default tagRouter
