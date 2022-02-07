const tagRouter = {
  route: null,
  name: null,
  title: '标签管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/tag/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '标签列表',
      type: 'view',
      name: 'tags',
      route: '/tag/list',
      filePath: 'view/tag/tag-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
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
