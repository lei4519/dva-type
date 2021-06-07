export const useTypeSelector = (
  selector: TypeSelector,
  equalityFn: (left: typeof selector, right: typeof selector) => boolean
) => {
  return useSelector(selector, equalityFn)
}
useTypeSelector(s => {
  const a = s.loading.effects['']
})

type TypeSelector<T extends Record<string, Model> = ModelRecord> = (
  state: UnionToIntersection<
    {
      [k in keyof T]: T[k]['state']
    }
  > &
    Loading
) => any

export const useTypeDispatch = () => {
  const dispatch = useDispatch()
  return useCallback((actions: ResolverActions) => dispatch(actions), [])
}
