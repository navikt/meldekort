import * as React from 'react';
import { Dispatch } from 'redux';
import { RootState } from '../../store/configureStore';
import { DemoActions } from '../../types/demo';
import { addItemToList } from '../../actions/demo';
import { connect } from 'react-redux';

type ReduxType =
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatcherToProps>;

interface State {
    inputText: string;
}

class Demo extends React.Component<ReduxType, State> {
    public state: State = { inputText: ''};

    public onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({inputText: e.target.value});
    }

    public onAddClick = () => {
        this.props.addItem(this.state.inputText);
        this.setState({inputText: ''});
    }

    render() {
        const { list, loading} = this.props;

        return (
            <div style={{margin: '20px'}}>
                <input value={this.state.inputText} onChange={this.onInputChange}/>
                <button onClick={this.onAddClick}>Add</button>
                <ul>
                    {list.map((l: any) => <li key={l}>{l}</li>)}
                </ul>
                {loading && <div>Loading...</div>}
            </div>
        );
    }
}

const mapStateToProps = ({demo}: RootState) => {
    const { list, loading } = demo;
    return { list, loading };
};

// mapper de redux-actions man skriver til en komponent som props
const mapDispatcherToProps = (dispatch: Dispatch<DemoActions>) => {
    return {
        addItem: (item: string) =>
            dispatch(addItemToList(item))
    };
};

export default connect(mapStateToProps, mapDispatcherToProps) (Demo);