import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from '@/components/About.vue'
import Login from '@/components/login/Login.vue'
import Deploy from '@/components/deploy/Deploy.vue'
import DeployEdit from '@/components/deploy/DeployEdit.vue'
import DeployDetail from '@/components/deploy/DeployDetail.vue'
import Plan from '@/components/plan/Plan.vue'
import PlanEdit from '@/components/plan/PlanEdit.vue'
import PlanDetail from '@/components/plan/PlanDetail.vue'
import Project from '@/components/project/Project.vue'
import Log from '@/components/others/Log.vue'
import Health from '@/components/others/Health.vue'
import Environment from '@/components/environment/Environment.vue'
import Task from '@/components/settings/Task.vue'
import Link from '@/components/settings/Link.vue'
import User from '@/components/settings/User.vue'
import Question from '@/components/qr/Question.vue'
import QuestionEdit from '@/components/qr/QuestionEdit.vue'
import QuestionDetail from '@/components/qr/QuestionDetail.vue'
import Require from '@/components/qr/Require.vue'
import RequireEdit from '@/components/qr/RequireEdit.vue'
import RequireDetail from '@/components/qr/RequireDetail.vue'
import Image from '@/components/environment/Image.vue'
import ImageHistory from '@/components/environment/ImageHistory.vue'
import TestTask from '@/components/test/TestTask.vue'
import TestTaskDetail from '@/components/test/TestTaskDetail.vue'
import Rack from '@/components/environment/Rack.vue'
import Device from '@/components/environment/Device.vue'
import Product from '@/components/environment/Product.vue'
import Topo from '@/components/topo/Topo.vue'
import TopoManage from '@/components/topo/TopoManage.vue'
import RCConfig from '@/components/manage/RcConfig.vue'
import Resource from '@/components/environment/resource/Resource.vue'
import Cicd from '@/components/cicd/Cicd.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children:[
      {
        path: '',
        components: {
          Contents: Deploy
        },
        meta: {
          title: '首页'
        }
      },
      {
        path: 'about',
        components: {
          Contents: About
        },
        meta: {
          title: '关于'
        }
      },
      {
        path: '/management/deploys',
        components: {
          Contents: Deploy
        },
        meta: {
          title: '部署记录'
        }
      },
      {
        path: '/management/deploys/:id/edit',
        components: {
          Contents: DeployEdit
        },
        meta: {
          title: '编辑部署'
        }
      },
      {
        path: '/management/deploys/:id/detail',
        components: {
          Contents: DeployDetail
        },
        meta: {
          title: '部署详情'
        }
      },
      {
        path: '/management/plans/:id/gotoDeploy',
        components: {
          Contents: DeployEdit
        },
        meta: {
          title: '转部署'
        }
      },
      {
        path: '/management/plans',
        components: {
          Contents: Plan
        },
        meta: {
          title: '版本计划'
        }
      },
      {
        path: '/management/plans/create',
        components: {
          Contents: PlanEdit
        },
        meta: {
          title: '新建计划'
        }
      },
      {
        path: '/management/plans/:id/edit',
        components: {
          Contents: PlanEdit
        },
        meta: {
          title: '编辑计划'
        }
      },
      {
        path: '/management/plans/:id/detail',
        components: {
          Contents: PlanDetail
        },
        meta: {
          title: '计划详情'
        }
      },
      {
        path: '/management/projects',
        components: {
          Contents: Project
        },
        meta: {
          title: '项目'
        }
      },
      {
        path: '/management/rcConfigs',
        components: {
          Contents: RCConfig
        },
        meta: {
          title: 'RC配置'
        }
      },
      {
        path: '/management/logs',
        components: {
          Contents: Log
        },
        meta: {
          title: '日志'
        }
      },
      {
        path: '/env/environments',
        components: {
          Contents: Environment
        },
        meta: {
          title: '环境信息'
        }
      },
      {
        path: '/env/health',
        components: {
          Contents: Health
        },
        meta: {
          title: '环境健康'
        }
      },
      {
        path: '/env/resource',
        components: {
          Contents: Resource
        },
        meta: {
          title: '资源管理'
        }
      },
      {
        path: '/env/images',
        components: {
          Contents: Image
        },
        meta: {
          title: '镜像信息'
        }
      },
      {
        path: '/env/imagesHistory',
        components: {
          Contents: ImageHistory
        },
        meta: {
          title: '镜像历史'
        }
      },
      {
        path: '/env/racks',
        components: {
          Contents: Rack
        },
        meta: {
          title: '机柜信息'
        }
      },
      {
        path: '/env/devices',
        components: {
          Contents: Device
        },
        meta: {
          title: '设备信息'
        }
      },
      {
        path: '/env/topos',
        components: {
          Contents: TopoManage
        },
        meta: {
          title: '环境拓扑'
        }
      },
      {
        path: '/management/products',
        components: {
          Contents: Product
        },
        meta: {
          title: '产品信息'
        }
      },
      {
        path: '/setting/tasks',
        components: {
          Contents: Task
        },
        meta: {
          title: '定时任务'
        }
      },
      {
        path: '/setting/cicds',
        components: {
          Contents: Cicd
        },
        meta: {
          title: 'CICD配置'
        }
      },
      {
        path: '/env/links',
        components: {
          Contents: Link
        },
        meta: {
          title: '链接信息'
        }
      },
      {
        path: '/setting/users',
        components: {
          Contents: User
        },
        meta: {
          title: '用户信息'
        }
      },
      {
        path: '/q_r/questions',
        components: {
          Contents: Question
        },
        meta: {
          title: '问题记录'
        }
      },
      {
        path: '/q_r/questions/create',
        components: {
          Contents: QuestionEdit
        },
        meta: {
          title: '新建问题'
        }
      },
      {
        path: '/q_r/questions/:id/edit',
        components: {
          Contents: QuestionEdit
        },
        meta: {
          title: '编辑问题'
        }
      },
      {
        path: '/q_r/questions/:id/detail',
        components: {
          Contents: QuestionDetail
        },
        meta: {
          title: '问题详情'
        }
      },
      {
        path: '/q_r/requires',
        components: {
          Contents: Require
        },
        meta: {
          title: '需求统计'
        }
      },
      {
        path: '/q_r/requires/create',
        components: {
          Contents: RequireEdit
        },
        meta: {
          title: '新建需求'
        }
      },
      {
        path: '/q_r/requires/:id/edit',
        components: {
          Contents: RequireEdit
        },
        meta: {
          title: '编辑需求'
        }
      },
      {
        path: '/q_r/requires/:id/detail',
        components: {
          Contents: RequireDetail
        },
        meta: {
          title: '需求详情'
        }
      },
      {
        path: '/test/tasks',
        components: {
          Contents: TestTask
        },
        meta: {
          title: '测试任务'
        }
      },
      {
        path: '/test/task/:id/detail',
        components: {
          Contents: TestTaskDetail
        },
        meta: {
          title: '测试任务'
        }
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/topo/:topoName',
    component: Topo
  }
]

const router = new Router({
  routes
})

export default router;
