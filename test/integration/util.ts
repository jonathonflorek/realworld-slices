import { getRepository } from 'typeorm';
import { UserEntity } from '../../src/models/UserEntity';
import { app } from '../../src';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
chai.use(chaiHttp);

export async function loadSampleUserAndLogin(
    username: string = 'username',
    email: string = 'username@realworld.io',
    bio: string = '',
    image: string = '',
): Promise<string> {
    await getRepository(UserEntity).insert({
        username,
        email,
        bio,
        image,

        salt: '21ac654d8e3a8d75ab53a2d57005a602',
        hash: '04928449b5040101fea12bfcc7ffedc3a8dd2ed72bfaa038750783ae951d9766b7bd2b6ef901b7308ae7c094adaf9038495a7651a35e77959f2dd66626bf42c0ea80bcf5c3d4397bdb0b29e2b13ecf1397c0aa9e6f60b388ddac4391be3ad7886cdc14b4ddfe3030184de52fc2d55065f55e2123bbef40e67b44db0d25463c8e7a8a88b3aa2811ef9f4a5d8d719f0eb463d3c5c9453534e0b18d2f3cf989ab34f49046dec29407129d665f6bffe19a853e74c85afb6034103fd108d7293b9b55f50caf0432b5d0b58580bf4e13c184afce66a2f3594577b7790308b06310bbfdd5619a5029898463271d444ee9ac13b1e935be23f35144debf41799d870d84d093305cbeb82f3c607f260694ebd788521089da4a14c251cff5f1160eca8e026f62962112f1555a7a7a364b7475f6a37e45fa87dc3efbbd268d7e85b6438295b364e03e0c815ac0a77323638c72dfa1e0f1aa1cf17972948a83a4cb526fc968706515e9a9e44a3b755bc93cdf72fc9b0ca5280beebacdff6e694c40a91ab2619c86fedfde4422f490d1f7dba13616ec13390e865ced46f7e1e22a976ca5f17cddd6a7b0bc6e0b70624838964e656f319bc3749e01a31f06bd72288cad2d0733637480839bb04586e490063ee8197b9e40cf6f1c081bf21df857ba27024aa34deace19211d83528557c506e2e1b0474a0802488e66756e7b54ce7ac997fef2f373',
    });

    const loginResult = await chai
        .request(app)
        .post('/api/users/login')
        .send({
            user: {
                email,
                password: 'Hp6V.M/5$mE:$?]H',
            },
        });
    
    return loginResult.body.user.token;
}