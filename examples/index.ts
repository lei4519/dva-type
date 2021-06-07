import { Effect, ResolverModels, Model } from '../index'
import { Reducer } from 'react-redux'

// 定义model类型
interface ListModel extends Model {
  state: {
    list: any[]
  }
  effects: {
    // 定义effect 传入 payload 类型
    getList: Effect<number | string>
    // 不需要 payload 的 effect
    getInfo: Effect
  }
  reducers: {
    merge: Reducer
  }
}

interface InfoModel extends Model {
  state: {
    info: number
  }
  effects: {
    // 定义effect 传入 payload 类型
    getInfo: [Effect<number | string>, { type: 'takeEvery' }]
  }
  reducers: [
    {
      save: Reducer
    },
    (reducer: Reducer<any>) => void
  ]
}

interface EmptyModel extends Model {}

// 使用 type 定义 models，将项目中的所有 model 进行收集
type Models = {
  list: ListModel
  info: InfoModel
  empty: EmptyModel
}

// 获取 state 和 actions 类型
type State = ResolverModels<Models>['state']
type Actions = ResolverModels<Models>['actions']

// 使用
const mapStateToProps = (state: State) => {
  state.loading.effects['']
  state.empty
}

const dispatch = (action: Actions) => {}

dispatch({
  type: 'info/getInfo',
  payload: 1,
})
