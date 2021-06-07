import { Model as DvaModel, EffectsCommandMap, EffectType } from 'dva'
import { ReducerEnhancer, Reducer } from 'react-redux'

export interface Model extends DvaModel {
  reducers?: {
    __R__?: Reducer
    [k: string]: Reducer
  }
}

/**
 * @param P effects 的 payload 类型
 */
export type Effect<P = undefined> = (
  action: { type: any; payload?: P },
  effect: EffectsCommandMap
) => void

/**
 * @description 提取 map 中的 value 类型
 */
type ValueType<T extends Record<any, any>> = T[keyof T]

/**
 * @description 将联合类型转换为交叉类型
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

/**
 * @description 提取 model 中的 effects 的 payload 类型
 */
type ResolverEffects<T extends Record<string, Model>> = ValueType<
  {
    [t in keyof T]: ValueType<
      {
        [k in keyof T[t]['effects']]: T[t]['effects'][k] extends (
          action: { type: any; payload?: infer A },
          effect: EffectsCommandMap
        ) => void
          ? A extends undefined
            ? {
                // @ts-expect-error
                type: `${t}/${k}`
                [k: string]: any
              }
            : {
                // @ts-expect-error
                type: `${t}/${k}`
                payload: A
                [k: string]: any
              }
          : T[t]['effects'][k] extends [
              (
                action: { type: any; payload?: infer A },
                effect: EffectsCommandMap
              ) => void,
              { type: EffectType }
            ]
          ? A extends undefined
            ? {
                // @ts-expect-error
                type: `${t}/${k}`
                [k: string]: any
              }
            : {
                // @ts-expect-error
                type: `${t}/${k}`
                payload: A
                [k: string]: any
              }
          : never
      }
    >
  }
>

/**
 * @description 提取 model 中的 reducers 类型
 */
export type ResolverReducers<T extends Record<string, Model>> = ValueType<
  {
    [t in keyof T]: T[t]['reducers'] extends {
      __R__?: Reducer
    }
      ? never
      : T[t]['reducers'] extends [infer A, ReducerEnhancer]
      ? ValueType<
          {
            [k in keyof A]: {
              // @ts-expect-error
              type: `${t}/${k}`
              payload: T[t]['state']
              [k: string]: any
            }
          }
        >
      : ValueType<
          {
            [k in keyof T[t]['reducers']]: {
              // @ts-expect-error
              type: `${t}/${k}`
              payload: T[t]['state']
              [k: string]: any
            }
          }
        >
  }
>

/**
 * @description 提取 model 中的 state 类型
 */
type ResolverState<T extends Record<string, Model>> = UnionToIntersection<
  {
    [k in keyof T]: T[k]['state']
  }
>

/* dva-loading 插件提示 */
interface Loading<T extends Record<string, Model>> {
  loading: {
    global: boolean
    models: {
      [k in keyof T]: boolean
    }
    effects: {
      [k in ResolverEffects<T>['type']]: boolean
    }
  }
}

export interface ResolverModels<T extends Record<string, Model>> {
  state: ResolverState<T> & Loading<T>
  actions: ResolverReducers<T> | ResolverEffects<T>
}
