import buildingStore from "../System/Lib/Widgets";

export default buildingStore(
    'environtment',
    {
        config: {}
    },
    {
        setConfig(state, action) {
            state.config = action.payload;
        },
    },
    _ => false,
    getState => ({
        getConfig: () => getState().config,
    })
)