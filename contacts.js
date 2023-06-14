/* Зроби імпорт модулів fs і path для роботи з файловою системою
Створи змінну contactsPath і запиши в неї шлях до файлу contacts.json. Для складання шляху використовуй методи модуля path.
Додай функції для роботи з колекцією контактів. У функціях використовуй модуль fs та його методи readFile() і writeFile()
Зроби експорт створених функцій через module.exports
 */

/**
 * Contacts module
 * @module contacts
 */

const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid"); //NB! mind version nanoid@3.3.4

//path to contacts file
const contactsPath = path.join(__dirname, "db", "contacts.json");

// TODO+ задокументувати кожну функцію
/**
 * @typedef {Object} Contact
 * @property {string} id - id
 * @property {string} name - name
 * @property {string} [phone] - phone number
 * @property {string} [email] - email
 */

/**
 * Retrieve all the contacts
 * @returns {Array.<Contact>}
 */
async function listContacts() {
	const buffer = await fs.readFile(contactsPath);
	return JSON.parse(buffer);
}

/**
 * Get a contact indentified by id
 * @param {string} contactId - the target contact id
 * @returns {Contact}
 */
async function getContactById(contactId) {
	const contacts = await listContacts();
	return contacts.find((contact) => contact.id === contactId);
}

/**
 * Remove a contact indentified by id
 * @param {string} contactId - the id of the contact to remove
 * @returns {Contact} - the removed contact
 */
async function removeContact(contactId) {
	const contacts = await listContacts();
	const index = contacts.findIndex((contact) => contact.id === contactId);
	if (index === -1) return null;

	const [contact] = contacts.splice(index, 1);
	await fs.writeFile(contactsPath, JSON.stringify(contacts));
	return contact;
}

/**
 * Add a contact described by parameters
 * @param {string} name - the contact name
 * @param {string} email - the contact email
 * @param {string} phone - the contact phone
 * @returns {Contact} - the added contact incl. id
 */
async function addContact(name, email, phone) {
	const contact = { id: nanoid(), name, email, phone };
	const contacts = await listContacts();
	contacts.push(contact);
	await fs.writeFile(contactsPath, JSON.stringify(contacts));
	return contact;
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
};
