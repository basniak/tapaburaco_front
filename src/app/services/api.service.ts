import { Injectable, OnInit, Injector } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import * as firebase from "firebase/app";
import {
  HttpClient,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from "@angular/common/http";

import { environment } from 'src/environments/environment';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { Usuario, User } from '../model/user/user';

import { LoadingBarService } from "@ngx-loading-bar/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseurl = environment.baseURL;
  public user: Observable<firebase.User>;
  private token: String = null;
  public isLoading = new BehaviorSubject(false);
  private requests: HttpRequest<any>[] = [];
  public userComplete = new BehaviorSubject(false);

  public tokenHeader = {
    'Content-Type': 'application/json'
  };
  public firebaseUser: User = {
    uid: null,
    email: "",
    displayName: "",
    photoURL: "",
    emailVerified: undefined
  };
  public usuario: Usuario = new Usuario();

  constructor(private http: HttpClient,
    public rotas: Router,
    public loadingBar: LoadingBarService,
    private storage: AngularFireStorage,
    public afAuth: AngularFireAuth,
    private toastr: ToastrService) {

    afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    this.user = afAuth.authState;
    this.user.subscribe(user => {
      try {
        if (user) {
          this.firebaseUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          };
          console.log('Usuario logado', this.firebaseUser.displayName)
          localStorage.setItem("user", JSON.stringify(this.firebaseUser));

          // this.getEmpresa()
          user
            .getIdToken(true)
            .then(res => {
              this.token = res;
              localStorage.setItem("token", res);
              // this.getEmpresa();
              this.getUsuario();
              this.loadingBar.complete();
            })
            .catch(e => {
              this.loadingBar.complete();
            });
        } else {
          localStorage.removeItem("user");
          // JSON.parse(localStorage.getItem('user'));
          this.token = null;
          localStorage.removeItem("token");
          console.log("Nenhum usuario logado");
        }
      } catch (error) {
        this.afAuth.auth.signOut();
      }
    });
  }
  async getUsuario() {
    let params = { id: this.firebaseUser.uid };
    return this.http.get(`${this.baseurl}users/:id`, { headers: this.tokenHeader, params })
  }
  public getData(rota): Observable<any> {

    return this.http.get(`${this.baseurl}${rota}`, { headers: this.tokenHeader })
  }

  public postData(rota, obj): Observable<any> {
    this.loadingBar.start();
    // console.log('post', rota, obj)
    return this.http.post(`${this.baseurl}${rota}`, obj, { headers: this.tokenHeader })
  }

  public doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(
        res => {
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }
  doRegister(value, arquivoImg) {
    return new Promise<any>((resolve, reject) => {
      this.loadingBar.start();
      firebase
        .auth()
        .createUserWithEmailAndPassword(value.email, value.pass)
        .then(res => {
          this.loadingBar.complete();
          this.loadingBar.start();
          this.doCheckEmail()
            .then(email => {
              this.loadingBar.complete();
              this.loadingBar.start();
              // console.log("email", email);
              this.uploadPerfilImagem(arquivoImg, res.user.uid)
                .then(async img => {
                  this.loadingBar.complete();
                  this.loadingBar.start();
                  //  console.log(img);
                  this.firebaseUser.photoURL = img.caminhoImagem;
                  this.firebaseUser.displayName = value.name;
                  value['displayName'] = value.name;
                  this.doUpdateUser(value.name, img.caminhoImagem)
                    .then(async tmp => {
                      this.loadingBar.complete();
                      this.loadingBar.start();
                      this.createUser({ ...this.firebaseUser, ...value }).subscribe(usuarioLogado => {
                        this.usuario = usuarioLogado
                        resolve(usuarioLogado)
                      }, errororo => {
                        console.log("Ecriar o usario usuario", errororo);
                        this.loadingBar.complete();
                        reject(errororo);
                      })
                    })
                    .catch(updateErro => {
                      console.log("Erro Update perfil do usuario", updateErro);
                      this.loadingBar.complete();
                      reject(updateErro);
                    });
                })
                .catch(imgErro => {
                  this.loadingBar.complete();
                  console.log("Erro uploadImg do usuario", imgErro);
                  reject(imgErro);
                });
            })
            .catch(errEmail => {
              this.loadingBar.complete();
              console.log("Erro Check Email do usuario", errEmail);
              reject(errEmail);
            });
        })
        .catch(err => {
          this.loadingBar.complete();
          console.log("Erro Criar usuario", err);
          reject(err);
        });
    });
  }

  doUpdateUser(displayName, photoURL) {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.currentUser
          .updateProfile({ displayName, photoURL })
          .then(async criar => resolve(criar))
          .catch(erro => reject(erro));
      } else {
        reject("usario invalido");
      }
    });
  }

  doCheckEmail() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.currentUser.sendEmailVerification();
        resolve();
      } else {
        reject();
      }
    });
  }
  public createUser(obj): Observable<any> {
    // console.log('Usuario criado', obj)
    return this.postData("users", obj)
  }

  uploadPerfilImagem(file, uid) {
    var caminhoImagem = "";
    var task = null;
    this.loadingBar.start();

    let path = `perfil/${uid}/${file.name}`;
    let fileRef = this.storage.ref(path.replace(/\s/g, ""));
    task = this.storage.upload(path.replace(/\s/g, ""), file);
    // uploadPercent = task.percentageChanges();
    return new Promise<any>((resolve, reject) => {
      task.then(up => {
        fileRef.getDownloadURL().subscribe(
          url => {
            caminhoImagem = url;
            this.loadingBar.complete();
            resolve({ caminhoImagem });
          },
          erroImg => {
            //  console.log(erroImg);
            this.loadingBar.complete();
            reject(erroImg);
          }
        );
      });
    });
  }
  uploadFoto(base64, uid, titulo) {
    this.loadingBar.start();
    let path = `promocao/${uid}/${titulo}`;
    let fileRef = this.storage.ref(path.replace(/\s/g, ""));
    let taksUpload = fileRef.putString(base64, "data_url");
    return new Promise<any>((resolve, reject) => {
      taksUpload.task.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          this.loadingBar.set(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (snapshot.state == "sucess") {
            // console.log('Uploaded a data_url string!', snapshot.downloadURL);
            this.loadingBar.complete();
            // this.loadingBar.
          }
        },
        erro => {
          // console.log('Falhou o upload')
          alert(
            "Falha ao fazer o upload da sua imagem, tente novamente mais tarde"
          );
          this.loadingBar.complete();
          reject(erro);
        },
        () => {
          taksUpload.task.snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
              // console.log('File available at', downloadURL);
              resolve(downloadURL);
            });
        }
      );
    });
  }

}
