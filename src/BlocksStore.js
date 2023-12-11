class BlocksStore {
    constructor () {
        this.hm = {};
        this.currentTab = null;
    }

    add(id, tracker) {
        if(this.hm[id]) {
            this.hm[id].push(tracker)
        } else {
            this.hm[id] = [tracker]
        }
    }

    remove(id) {
        delete this.hm[id]
    }

    get(id) {
        return this.hm[id]
    }    

    setTab(id) {
        this.currentTab = id;
    }
}

const staticBlocksStore = new BlocksStore();
export default staticBlocksStore;