#ifndef TABLE_H
#define TABLE_H

#include <stdio.h>
#include <stdlib.h>

// List element for Dictionary lists.
typedef struct ListNode {
	struct ListNode *next;
	struct ListNode *prev;
	char *key;
	char *value;
	int frequency;
} ListNode;

// Dictionary structure that includes the lists of elements and their number.
typedef struct Dictionary {
	ListNode **lists;		// lists of elements.
	int N;					// number of lists.
} Dictionary;


// Initializes an empty Dictionary structure.
Dictionary* createDictionary(int N);

// Adds an element to the Dictionary structure.
void addElement(Dictionary *dictionary, char *key, char *value, int frequency);

// Removes an element from the Dictionary structure.
void removeElement(Dictionary *dictionary, char *key, char *value);

// Prints all the elements from all the lists of the Dictionary structure.
void printDictionary(FILE *f, Dictionary *dictionary);

// Gets all the elements with the specified key and increments the frequencies.
ListNode* get(Dictionary *dictionary, char *key);

// Prints all the elements with the specified value.
void printValue(FILE *f, Dictionary *dictionary , char *value);

// Prints all the elements with the specified frequency.
void printFrequency(FILE *f, Dictionary *dictionary , int frequency);

// Returns a list containing the elements with the specified value.
ListNode* unionValues(Dictionary *dictionary, char *value);

// Returns a list containing the elements with maximum frequency in each list.
ListNode* unionMaxFrequencies(Dictionary *dictionary);

// Returns a new Dictionary with reversed lists of the input structure.
Dictionary* reverseLists(Dictionary *dictionary);

// Prints a double-linked non-circular list.
void printList(FILE *f, ListNode *list);

// Frees all the memory allocated for the Dictionary.
void freeDictionary(Dictionary *dictionary);

// Frees all the memory allocated for a double-linked non-circular list.
void freeList(ListNode *list);

//------------------------------------------------------------------------------

Dictionary* createDictionary(int N) {
	// TODO
	Dictionary *dictionary = (Dictionary*)malloc(sizeof(Dictionary));
	dictionary->N = N;
	dictionary->lists = (ListNode**)malloc(N * sizeof(ListNode*));

	//de ce nu mai primesc puncte pe test_easy_0 daca aloc memorie pentru fiecare lista :(
	/* Problema nu e de aici, ci din printDictionary() */
	for(int i = 0; i < N; i++){
		dictionary->lists[i] = (ListNode*)malloc(sizeof(ListNode));
	}
	

	return dictionary;
}

//functie auxiliara pentru a calcula cate elemente sunt in dictionar
int number_of_elements (Dictionary *dictionary) {
	int n = 0;

	for (int i = 0; i < dictionary->N; i++){

		ListNode *node = dictionary->lists[i];

		if (node){

			do {

				n++;
				node = node->next;

			} while (node != dictionary->lists[i]);
		}
	}
	return n;
}

void addElement(Dictionary *dictionary, char *key, char *value, int frequency) {
	// TODO
	
	ListNode *node;

	 int sum = 0, list_capacity = 0;

	 for (int i = 0; i < strlen(key); i++){
	 	sum += (int)(key[i]);
	 }

	 int r = sum % dictionary->N; //r = lista corespunzatoare elementului ce trebuie adaugat

	 node = dictionary->lists[r]; //inceputul listei r

	 if (node != NULL) {
	 	//cazul in care elementul exista deja si doar ii actualizam frequency
	 	do {
	 		if (node->key == key && node->value == value){
	 			node->frequency += frequency;
	 			return;
	 		}
	 		node = node->next;
	 	} while (node != dictionary->lists[r]);

	 	if(dictionary->lists[r] != NULL) {

			do {

			list_capacity++;
			node = node->next;

			} while(node != dictionary->lists[r]);

			if(list_capacity >= dictionary->N) {
				//am ajuns cu node pe ultimul element din lista r si il eliminam
				dictionary->lists[r]->prev = node->prev; 
				dictionary->lists[r]->prev->next = node->next;
				free(node);
				node = NULL;

	 		}
	 	}

	 	if (number_of_elements(dictionary) > 2 * dictionary->N){

	 		//eliminam ultimul element din fiecare lista
	 		for (int i = 0; i < dictionary->N; i++){

	 			node = dictionary->lists[i];
	 			node = node->prev;
	 			node->prev->next = node->next;
				node->next->prev = node->prev;
	 			free(node);

	 		}

	 	}

	 	node = dictionary->lists[r];
	 	//cazul in care elementul pe care vrem sa il adaugam are frecventa mai mare decat primul element al listei
	 	//sau are frecventa egala cu primul, dar cheia e inaintea cheii primului element in ordine alfabetica
	 	//sau are aceeasi frecventa si aceeasi cheie ca primul, dar valoarea e inaintea valorii primului in ordine alfabetica
	 	//deci il adaugam pe prima pozitie
	 	if (node->frequency < frequency || 
	 	   (node->frequency == frequency && strcmp(node->key, key) > 0) ||
	 	   (node->frequency == frequency && strcmp(node->key, key) == 0 && strcmp(node->value, value) > 0)){

	 		ListNode *newNode = (ListNode*)malloc(sizeof(ListNode));
	 		newNode->key = key;
	 		newNode->value = value;
	 		newNode->frequency = frequency;
	 		node->prev->next = newNode;
	 		newNode->prev = node->prev;
	 		newNode->next = node;
	 		node->prev = newNode;
	 		dictionary->lists[r] = newNode;	

	 	} else {
	 		//cazul in care adaugam elementul in interiorul listei sau la final
	 		do {

	 			if (node->frequency > frequency || 
	 	   		   (node->frequency == frequency && strcmp(node->key, key) < 0) ||
	 	    	   (node->frequency == frequency && strcmp(node->key, key) == 0 && strcmp(node->value, value) < 0)) {

						ListNode *newNode = (ListNode*)malloc(sizeof(ListNode));
	 					newNode->key = key;
	 					newNode->value = value;
	 					newNode->frequency = frequency;
	 					newNode->prev->next = newNode;
	 					newNode->prev = node->prev;
	 					newNode->next = node;
						node->prev = newNode;
						break;

				}
	 			node = node->next;

			} while (node != dictionary->lists[r]);
	 	} 
		
	 } else {
	 	//cazul in care lista era goala
	 	node = (ListNode*)malloc(sizeof(ListNode));
	 	node->key = key;
	 	node->value = value;
	 	node->frequency = frequency;
	 	node->next = node;
	 	node->prev = node;
	 }
    return;
}

void removeElement(Dictionary *dictionary, char *key, char *value) {
	// TODO
	for(int i = 0; i < dictionary->N; i++) {

		ListNode* node = dictionary->lists[i];

		do {
			//determinam pozitia elementului pe care vrem sa il eliminam
			if(strcmp(node->key, key) || strcmp(node->value, value)) {
				node = node->next;

			}

		} while(node != dictionary->lists[i]);

		//cazul in care avem un singur element in lista (primul e egal cu ultimul)
		if(node == dictionary->lists[i] && node == dictionary->lists[i]->prev) {

			dictionary->lists[i] = dictionary->lists[i]->prev = NULL;
			free(node);
			node = NULL;
		}

		//cazul in care vrem sa eliminam primul element din lista, iar lista are mai mult de un element
		else if(node == dictionary->lists[i]) {

			dictionary->lists[i] = node->next;
			dictionary->lists[i]->prev = node->prev;
			free(node);
			node = NULL;
		}

		//cazul in care vrem sa eliminam ultimul element din lista, iar lista are mai mult de un element
		else if(node == dictionary->lists[i]->prev) {

			dictionary->lists[i]->prev = node->prev; 
			dictionary->lists[i]->prev->next = node->next;
			free(node);
			node = NULL;

		}

		//cazul in care vrem sa eliminam un element din interiorul listei
		else {

			node->next->prev = node->prev;
			node->prev->next = node->next;
			free(node);
			node = NULL;
		}

	}
	return;
}

void printDictionary(FILE *f, Dictionary *dictionary) {
	// TODO
	ListNode* node = NULL;

	for (int i = 0; i < dictionary->N; i++) {

		fprintf(f, "List %d: ", i);

	 	node = dictionary->lists[i];

	 	/*Daca lista are un singur element, atunci cand faci "node = node->next" e foarte probabil sa dai peste NULL.
	 	  De fapt, asta ti se intampla la test_easy_0 daca nu comentezi alocarea fiecarei liste.
	 	  Aici mai ai nevoie sa te asiguri ca node->key sau node->value nu sunt nule. Eu am pus check-ul cu "node->frequency != 0".
	 	  */
	 	if (node){

			do {
				if(node->frequency != 0) {
					fprintf(f, "(%s, %s, %d) ", node->key, node->value, node->frequency);
				}
				
				node = node->next;

	 		} while (node != NULL && node != dictionary->lists[i]);	

		 }

		fprintf(f, "\n"); 
	 }
	 
	return;
}

ListNode* get(Dictionary *dictionary, char *key) {
	// TODO
	//creare lista cu elementele cu cheia key
	ListNode* myList; //head-ul listei
	ListNode* newNode = (ListNode*)malloc(sizeof(ListNode));

	for(int i = 0; i < dictionary->N; i++) {

		ListNode* aux = dictionary->lists[i];

		do {

			if(aux->key == key) {

				newNode->key = key;
				newNode->value = aux->value;
				newNode->frequency = aux->frequency;
				newNode->next = NULL;
				ListNode* last = myList;

				if(myList == NULL) {

					newNode->prev = NULL;
					myList = newNode;

				}

				else {

					while(last->next != NULL){
						last = last->next;
					}

					last->next = newNode;
					newNode->prev = last;
				}
							
			}

			aux = aux->next;

		} while(aux != dictionary->lists[i]);
	}

	//incrementare frequency pentru elementele cu cheia key din dictionar
	for(int j = 0; j < dictionary->N; j++) {

		ListNode* node = dictionary->lists[j];

		do {

			if(node->key == key){
				node->frequency++;
			}

			node = node->next;

		} while(node != dictionary->lists[j]);

		dictionary->lists[j] = node->next; //node devine ultimul element al listei circulare, deci node->next e primul
	}

	//reordonarea elementelor din listele dictionarului

	for(int k = 0; k < dictionary->N; k++) {
		ListNode* current = dictionary->lists[k];
		ListNode* temp;

		do{
			if(current->frequency < current->next->frequency) {
				//interschimb doar valorile din noduri ca sa nu mai refac legaturile 
				temp->frequency = current->frequency;
				temp->key = current->key;
				temp->value = current->value;

				current->frequency = current->next->frequency;
				current->key = current->next->key;
				current->value = current->next->value;

				current->next->frequency = temp->frequency;
				current->next->key = temp->key;
				current->next->value = temp->value;
			}

			else if(current->frequency == current->next->frequency && 
				(strcmp(current->key, current->next->key) < 0)) {

				temp->key = current->key;
				temp->value = current->value;

				current->key = current->next->key;
				current->value = current->next->value;

				current->next->key = temp->key;
				current->next->value = temp->value;
			}

			else if(current->frequency == current->next->frequency && 
				strcmp(current->key, current->next->key) == 0 && 
				strcmp(current->value, current->next->value) < 0) {

				temp->value = current->value;

				current->value = current->next->value;

				current->next->value = temp->value;
			}

			current = current->next;
		} while(current != dictionary->lists[k]);

		dictionary->lists[k] = current->prev;
	}

	return myList;

}

void printValue(FILE *f, Dictionary *dictionary , char *value) {
	// TODO

	ListNode* node;

	for (int i = 0; i < dictionary->N; i ++) {

	 	node = dictionary->lists[i];

	 	if(node) {

			do {

				if(node->value == value) {
					fprintf(f, "(%s, %s, %d) ", node->key, node->value, node->frequency);
					node = node->next;
				}

	 		} while(node != dictionary->lists[i]);

		 } 

		 else {
			fprintf(f, "\n"); 
		}

	}
	 
	return;
}

void printFrequency(FILE *f, Dictionary *dictionary , int frequency) {
	// TODO

	ListNode* node;

	for (int i = 0; i < dictionary->N; i ++) {

	 	node = dictionary->lists[i];

	 	if (node){

			do {

				if(node->frequency == frequency){

					fprintf(f, "(%s, %s, %d) ", node->key, node->value, node->frequency);
					node = node->next;

				}

	 		} while (node != dictionary->lists[i]);

		 }
		 
		else {
			fprintf(f, "\n"); 
		}
	}
	 

	return;
}

ListNode* unionValues(Dictionary *dictionary, char *value) {
	// TODO


	ListNode* myList; //head-ul listei
	ListNode* newNode = (ListNode*)malloc(sizeof(ListNode));

	for(int i = 0; i < dictionary->N; i++){

		ListNode* aux = dictionary->lists[i];

		do{

			if(aux->value == value){

				newNode->key = aux->key;
				newNode->value = value;
				newNode->frequency = aux->frequency;
				newNode->next = NULL;
				ListNode* last = myList;

				if(myList == NULL){

					newNode->prev = NULL;
					myList = newNode;

				}

				else {

					while(last->next != NULL){
						last = last->next;
					}

					last->next = newNode;
					newNode->prev = last;
				}
							
			}

			aux = aux->next;

		} while(aux != dictionary->lists[i]);
	}

	return myList;

}

ListNode* unionMaxFrequencies(Dictionary *dictionary) {
	// TODO

	ListNode* myList; //head-ul listei
	ListNode* newNode = (ListNode*)malloc(sizeof(ListNode));

	for(int i = 0; i < dictionary->N; i++){

		ListNode* aux = dictionary->lists[i];
		int max_freq = aux->frequency; 

		/*Listele au primul element cu frecventa maxima (sunt ordonate descrescator dupa frequency
		 *deci am considerat ca trebuie sa adaug primul element din fiecare lista si sa verific 
		 *doar daca mai exista elemente cu aceeasi frecventa ca acesta si sa il adaug si pe el in 
		 *noua lista necirculara
		 */

		do{

			if(aux->frequency == max_freq){

				newNode->frequency = max_freq;
				newNode->key = aux->key;
				newNode->value = aux->value;
				newNode->next = NULL;
				ListNode* last = myList;

				if(myList == NULL){

					newNode->prev = NULL;
					myList = newNode;

				}

				else {

					while(last->next != NULL){
						last = last->next;
					}

					last->next = newNode;
					newNode->prev = last;
				}
							
			}

			aux = aux->next;

		} while(aux != dictionary->lists[i]);
	}

	return myList; 
}

Dictionary* reverseLists(Dictionary *dictionary) {
	// TODO
	Dictionary *reversedDict;
	reversedDict = createDictionary(dictionary->N);

	for (int i = 0; i < dictionary->N / 2; i++){

		ListNode* node = dictionary->lists[i];
		reversedDict->lists[i] = dictionary->lists[dictionary->N - i - 1];
		reversedDict->lists[dictionary->N - i - 1] = node;

	}

/* De ce nu merge asa si merge cea de sus? Ciudaaaaaat
	for(int i = 0; i < dictionary->N; i++){
		ListNode* temp = NULL;
		ListNode* current = dictionary->lists[i];

		do{
			temp = current->prev;
			current->prev = current->next;
			current->next = temp;
			current = current->prev;

		}while(current != dictionary->lists[i]);

		if(temp != dictionary->lists[i]){
			dictionary->lists[i] = temp->prev;
		}
	}
*/

	return reversedDict;
}

void printList(FILE *f, ListNode *list) {
	// TODO

	if(list == NULL){

		fprintf(f, "\n");

	}

	else{

		for(ListNode* node = list; node != NULL; node = node->next) {

			fprintf(f, "(%s, %s, %d) ", node->key, node->value, node->frequency);

		}

	}

	return;
	
}

void freeDictionary(Dictionary *dictionary) {
	// TODO
	if(dictionary == NULL)
		return;

	for(int i = 0; i < dictionary->N; i++) {

		freeList(dictionary->lists[i]);

	}

	// free(dictionary->lists);
	free(dictionary);

	return;
}

void freeList(ListNode *list) {
	// TODO
	if(list == NULL)
		return;

	// for(ListNode* temp = list; temp != NULL; temp = temp->next) {

	// 	ListNode* aux = temp;
	// 	temp = temp->next;
	// 	free(aux);

	// }

	ListNode* current = list;
	while (current)
	{
	    ListNode *temp = current;
	    current = current->next;
	    free(temp);
	}

	list = NULL;
	return;
}

#endif
