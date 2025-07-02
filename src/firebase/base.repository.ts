import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';

@Injectable()
export abstract class BaseRepository<T> {
  private _firestore: admin.firestore.Firestore | null = null;
  protected abstract collectionName: string;

  constructor(protected readonly firebaseService: FirebaseService) {}

  protected get firestore(): admin.firestore.Firestore {
    if (!this._firestore) {
      this._firestore = this.firebaseService.getFirestoreInstance();
    }
    return this._firestore;
  }

  protected get collection(): admin.firestore.CollectionReference<T> {
    return this.firestore.collection(
      this.collectionName,
    ) as admin.firestore.CollectionReference<T>;
  }

  // 하위 컬렉션 접근을 위한 메서드
  protected getSubCollection<S>(
    parentId: string,
    subCollectionName: string,
  ): admin.firestore.CollectionReference<S> {
    return this.collection
      .doc(parentId)
      .collection(subCollectionName) as admin.firestore.CollectionReference<S>;
  }

  async create(data: Omit<T, 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    } as T;

    const docRef = await this.collection.add(docData);
    return docRef.id;
  }

  // 특정 ID로 문서 생성 (사용자 UID 등을 문서 ID로 사용할 때)
  async createWithId(
    id: string,
    data: Omit<T, 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    const now = new Date();
    const docData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    } as T;

    await this.collection.doc(id).set(docData);
    return id;
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { ...doc.data(), id: doc.id } as T;
  }

  async findAll(): Promise<T[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as T);
  }

  async findByField(field: keyof T, value: any): Promise<T[]> {
    const snapshot = await this.collection
      .where(field as string, '==', value)
      .get();
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as T);
  }

  async update(
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt'>>,
  ): Promise<void> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    await this.collection.doc(id).update(updateData);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async exists(id: string): Promise<boolean> {
    const doc = await this.collection.doc(id).get();
    return doc.exists;
  }

  // 하위 컬렉션 CRUD 메서드들
  async createSubDocument<S>(
    parentId: string,
    subCollectionName: string,
    data: Omit<S, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<string> {
    const now = new Date();
    const subDocData = {
      ...data,
      createdAt: now,
      updatedAt: now,
    } as S;

    const subCollection = this.getSubCollection<S>(parentId, subCollectionName);
    const docRef = await subCollection.add(subDocData);
    return docRef.id;
  }

  async findSubDocuments<S>(
    parentId: string,
    subCollectionName: string,
  ): Promise<S[]> {
    const subCollection = this.getSubCollection<S>(parentId, subCollectionName);
    const snapshot = await subCollection.get();
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as S);
  }

  async findSubDocumentById<S>(
    parentId: string,
    subCollectionName: string,
    subDocId: string,
  ): Promise<S | null> {
    const subCollection = this.getSubCollection<S>(parentId, subCollectionName);
    const doc = await subCollection.doc(subDocId).get();
    if (!doc.exists) {
      return null;
    }
    return { ...doc.data(), id: doc.id } as S;
  }

  async updateSubDocument<S>(
    parentId: string,
    subCollectionName: string,
    subDocId: string,
    data: Partial<Omit<S, 'id' | 'createdAt'>>,
  ): Promise<void> {
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    const subCollection = this.getSubCollection<S>(parentId, subCollectionName);
    await subCollection.doc(subDocId).update(updateData);
  }

  async deleteSubDocument(
    parentId: string,
    subCollectionName: string,
    subDocId: string,
  ): Promise<void> {
    const subCollection = this.getSubCollection(parentId, subCollectionName);
    await subCollection.doc(subDocId).delete();
  }
}
