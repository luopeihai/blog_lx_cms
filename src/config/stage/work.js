const workRouter = {
  route: null,
  name: null,
  title: '作品管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'view/work/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '作品列表',
      type: 'view',
      name: 'works',
      route: '/work/list',
      filePath: 'view/work/work-list.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '作品添加',
      type: 'view',
      name: 'WorkCreate',
      route: '/work/add',
      filePath: 'view/work/work-create.vue',
      inNav: true,
      icon: 'iconfont icon-add',
    },
  ],
}

export default workRouter
