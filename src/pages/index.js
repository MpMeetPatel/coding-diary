import React, { Component } from 'react';
import Card from '../components/card';
// import Header from '../components/header';
import AddUpdateModal from '../components/addUpdateModal';
import SearchModal from '../components/searchModal';
import ConfirmationModal from '../components/confirmationModal';
import { Switch, Route, withRouter } from 'react-router-dom';
import Add from './add';
import Edit from './edit';
import GlobalSearch from './globalSearch';
import { memo } from 'react';
import { CardsContext } from '../utils/cardsContext';
import { addIconBase64, searchIconBase64 } from '../utils/iconBase64';
import { ToastContainer } from 'react-toastify';

class MainPage extends Component {
    static contextType = CardsContext;

    componentWillUpdate() {
        const {
            history: {
                location: { pathname },
            },
        } = this.props;
        if (
            pathname.startsWith('/add') ||
            pathname.startsWith('/edit') ||
            pathname.startsWith('/search') ||
            pathname.startsWith('/delete')
        ) {
            document.body.className = 'overflow-hidden';
        } else {
            document.body.className = '';
        }
    }
    render() {
        const {
            history: {
                location: { pathname },
            },
        } = this.props;
        return (
            <main>
                <ToastContainer />
                <Switch>
                    <Route path="/add" exact>
                        <AddUpdateModal isOpen={true}>
                            <Add />
                        </AddUpdateModal>
                    </Route>
                    <Route path="/edit/:id" exact>
                        <AddUpdateModal isOpen={true}>
                            <Edit />
                        </AddUpdateModal>
                    </Route>
                    <Route path="/delete/:id" exact>
                        <ConfirmationModal isOpen={true}>
                            {/* <Edit /> */}
                        </ConfirmationModal>
                    </Route>
                    <Route path="/search" exact>
                        <SearchModal isOpen={true}>
                            <GlobalSearch />
                        </SearchModal>
                    </Route>
                </Switch>

                <div className="row" style={{ flexWrap: 'nowrap' }}>
                    {this.context.cards &&
                        this.context.cards.map((category, idx) => {
                            return (
                                <div
                                    className="col rounded bg-gray-200 mr-8 mt-2"
                                    key={`column${idx}`}
                                >
                                    <div>
                                        <p className="bg-indigo-500 py-2 mt-4 text-center text-white shadow rounded text-lg font-bold">
                                            {category.type
                                                ? category.type
                                                : 'No Category'}
                                        </p>
                                    </div>
                                    <div className="kanban my-4">
                                        {category.result &&
                                            category.result.map((ele) => {
                                                return (
                                                    <Card
                                                        key={ele.id}
                                                        name={ele.data.name}
                                                        detail={ele.data.detail}
                                                        id={ele.id}
                                                        tags={ele.data.tags}
                                                    />
                                                );
                                            })}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {this.context.isQueryDone && this.context.cards.length === 0 && (
                    <div className="fixed bottom-0 inset-x-0 px-2 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
                        <span
                            className="bg-white py-8 rounded shadow-xl w-4/6 lg:text-4xl sm:text-2xl text-center"
                            role="img"
                            aria-hidden="true"
                        >
                            🐱‍🏍{` `}Don't be Lazy person, start creating your
                            coding-diary{` `} 🐱‍🏍
                        </span>
                    </div>
                )}

                <footer>
                    <img
                        src={addIconBase64}
                        alt="add-icon"
                        className={`btn-fixed bg-white px-3 py-1 rounded outline-none h-10 cursor-pointer  ${
                            pathname !== '/' ? 'hidden' : ''
                        }`}
                        onClick={() => this.props.history.replace('/add')}
                    />
                    <img
                        src={searchIconBase64}
                        alt="add-icon"
                        className={`search-btn-fixed bg-white px-3 py-1 rounded outline-none h-10 cursor-pointer  ${
                            pathname !== '/' ? 'hidden' : ''
                        }`}
                        onClick={() => this.props.history.replace('/search')}
                    />
                </footer>
            </main>
        );
    }
}

export default memo(withRouter(MainPage));
