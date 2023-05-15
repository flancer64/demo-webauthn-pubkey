/**
 *  Implementation of the mole component of '@flancer32/teq-ant-auth' plugin.
 *
 * @implements Fl32_Auth_Back_Api_Mole
 */
export default class Demo_Back_Mole_Auth_User {

    constructor(spec) {
        // DEPS
        /** @type {Demo_Back_Act_User_Read.act|function} */
        const actUserRead = spec['Demo_Back_Act_User_Read$'];
        /** @type {Demo_Shared_Dto_Session} */
        const dtoSess = spec['Demo_Shared_Dto_Session$'];

        /**
         * @inheritDoc
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {string} userRef
         * @returns @returns {Promise<{userBid:number, user: Object}>}
         */
        this.load = async function ({trx, userRef: email}) {
            const {
                /** @type {Demo_Back_RDb_Schema_User.Dto} */
                user
            } = await actUserRead({trx, email});
            return {userBid: user?.bid, user};
        };

        /**
         * @inheritDoc
         *
         * @param {TeqFw_Db_Back_RDb_ITrans} [trx]
         * @param {number} userBid
         * @returns {Promise<{sessionData: Object}>}
         */
        this.readSessionData = async function ({trx, userBid}) {
            const {
                /** @type {Demo_Back_RDb_Schema_User.Dto} */
                user
            } = await actUserRead({trx, userBid});
            const sessionData = dtoSess.createDto();
            sessionData.email = user.email;
            sessionData.userId = user.bid;
            return {sessionData};
        };
    }
}
