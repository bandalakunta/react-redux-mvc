import _get from 'lodash/get';
import _set from 'lodash/set';
import _isPlainObject from 'lodash/isPlainObject';
import cloneDeep from 'lodash/cloneDeep';
import {merge} from './helpers';

function prepare (obj) {
    return obj;
}

class Model {
    state = {
        data: {},
        waiting: {},
        failed: {}
    };

    setWaiting (prop) {
        this.set('waiting.' + prop, true);
        return this;
    }

    resetWaiting (prop) {
        this.set('waiting.' + prop, false);
        return this;
    }

    setFailed (prop) {
        this.set('failed.' + prop, true);
        return this;
    }

    resetFailed (prop) {
        this.set('failed.' + prop, false);
        return this;
    }

    isWaiting (key) {
        return this.state.waiting[key];
    }

    isFailed (key) {
        return this.state.failed[key];
    }

    getWaiting () {
        return this.state.waiting;
    }

    getFailed () {
        return this.state.failed;
    }

    /**
     * устанавливает значение prop в value
     * @param {String|Object} prop
     * @param value
     */
    set (prop, value) {
        if (!prop) {
            throw Error('Property must be set');
        }
        //устанавливает значения для целого объекта
        if (_isPlainObject(prop)) {
            Object.entries(prop).forEach(([key, value]) => {
                if (value) {
                    this.state[key] = value;
                }
            });
        }
        else if (typeof prop === 'string' && value !== undefined) {
            //позволяет устанавливать значения для вложенных ключей. Нармер set('user.name','Ivan')
            _set(this.state, prop, value);
        }
        return this;
    }

    constructor (props) {
        if (props) {
            this.state = prepare(props);
        }
    }

    update(data) {
        this.state = prepare(data);
        return this;
    }

    getState (prop) {
        return prop ? _get(this.state, prop) : this.state;
    }

    updateState (updates) {
        this.state = merge(cloneDeep(this.state), updates);
        return this;
    }

    static newState (oldState, updates) {
        return merge(cloneDeep(oldState), updates);
    }

}

export default Model;