#!/usr/bin/env node
'use strict';
/** Main script to create and to run TeqFW backend application. */
// IMPORT
import {dirname, join} from 'node:path';
import Container from '@teqfw/di';
import {readFileSync} from "node:fs";

// VARS
/* Resolve paths to main folders */
const url = new URL(import.meta.url);
const script = url.pathname;
const bin = dirname(script);
const root = join(bin, '..');

// FUNCS
/**
 * Create and setup DI container.
 * @param {string} root
 * @returns {TeqFw_Di_Shared_Container}
 */
function initContainer(root) {
    /** @type {TeqFw_Di_Shared_Container} */
    const res = new Container();
    const pathDi = join(root, 'node_modules/@teqfw/di/src');
    const pathCore = join(root, 'node_modules/@teqfw/core/src');
    res.addSourceMapping('TeqFw_Di', pathDi, true, 'mjs');
    res.addSourceMapping('TeqFw_Core', pathCore, true, 'mjs');
    return res;
}

/**
 * Read project version from './package.json' or use default one.
 * @param root
 * @returns {*|string}
 */
function readVersion(root) {
    const filename = join(root, 'package.json');
    const buffer = readFileSync(filename);
    const content = buffer.toString();
    const json = JSON.parse(content);
    return json?.version ?? '0.1.0';
}

// MAIN
try {
    const container = initContainer(root);
    const version = readVersion(root);
    /** Construct backend app instance using Container then init app & run it */
    /** @type {TeqFw_Core_Back_App} */
    const app = await container.get('TeqFw_Core_Back_App$');
    await app.init({path: root, version});
    await app.run();
} catch (e) {
    console.error('Cannot create or run TeqFW application.');
    console.dir(e);
}
