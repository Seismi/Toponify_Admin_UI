"use strict";
const Rx = require("rxjs/Rx");
const { Observable } = Rx;
const { concatMap, toArray } = require("rxjs/operators");
const _ = require("lodash");
const Parse = require("parse/node");

const BOOTSTRAP_DATA = require("./bootstrap_data");

const bootstrap = () => {
  console.log("Bootstrapping...");
  Observable.from(BOOTSTRAP_DATA.users)
    .pipe(concatMap(user => upsertUser(user)), toArray())
    .mergeMap(_ => {
      return Observable.from(BOOTSTRAP_DATA.versions).pipe(
        concatMap(version => upsertVersion(version, false)),
        toArray()
      );
    })
    .mergeMap(_ => {
      return Observable.from(BOOTSTRAP_DATA.models).pipe(
        concatMap(model => upsertModel(model, false)),
        toArray()
      );
    })
    .mergeMap(_ => {
      return Observable.from(BOOTSTRAP_DATA.attributes).pipe(
        concatMap(attribute => upsertAttribute(attribute, false)),
        toArray()
      );
    })
    .subscribe();
};

const upsertUser = data => {
  return fromPromise(
    new Parse.Query(Parse.User)
      .equalTo("username", data.username)
      .first({ useMasterKey: true })
      .then(user => {
        if (!user) {
          user = new Parse.User();
        }

        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            user.set(key, data[key]);
          }
        }

        if (user.isNew()) {
          console.log("Signup user " + JSON.stringify(user));
          return user.signUp(null);
        } else {
          console.log("Updating user " + JSON.stringify(user));
          return user.save(null, { useMasterKey: true });
          // return user;
        }
      })
      .catch(error => {
        console.error("Unable to save " + data.username + ": " + error);
        return error;
      })
  );
};

const _upsertData = (name, data) => {
  const dataClass = Parse.Object.extend(name);
  return fromPromise(
    new Parse.Query(dataClass)
      .equalTo("key", data.key)
      .first({ useMasterKey: true })
      .then(metaName => {
        if (!metaName) {
          metaName = new dataClass();
        }

        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            metaName.set(key, data[key]);
          }
        }

        return metaName.save(null, { useMasterKey: true }).then(result => {
          console.log("Creating " + metaName + ":" + JSON.stringify(result));
          return result;
        });
      })
      .catch(error => {
        console.error("Unable to save: " + error);
        return error;
      })
  );
};

const upsertVersion = data => {
  return _upsertData("Versions", data);
};

const upsertModel = data => {
  return _upsertData("Models", data);
};

const upsertAttribute = data => {
  return _upsertData("Attributes", data);
};

const fromPromise = promise => {
  return Observable.create(observer => {
    promise
      .then(result => {
        observer.next(result);
        observer.complete();
      })
      .catch(error => {
        console.log(error);
        observer.error(error);
      });
  });
};

Parse.serverURL = "http://localhost:8200/parse";
Parse.initialize("appId", null, "masterKey");
bootstrap();
