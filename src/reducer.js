export default function Reducer(state, newState) {
    switch (newState.type) {
        case "filterSet":
            return newState.payload
        default:
            return {}
    }
}