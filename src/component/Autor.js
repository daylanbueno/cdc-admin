import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './InputCustomizado';
import ButtonComponent from './ButtonComponent';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = {nome:'',email:'',senha:''};
        this.enviaForm = this.enviaForm.bind(this); // bind(this) quer dizer que o this é do react.
        this.setNome = this.setNome.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.setSenha = this.setSenha.bind(this);
    }

    enviaForm(evento){
        evento.preventDefault();
        console.log(this);
        $.ajax({
           url:'http://localhost:8080/api/autores',
           contentType:'application/json', // indicando formado que dados para ser enviado
           dataType:'json', // qual tipo de resposta vai receber
           type:'post', // tipo de requisição
           data: JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
           success: function(novaLista) { // se der bom.
             console.log("enviado com sucesso");
             PubSub.publish('atualiza-lista-autores',novaLista);
             this.setState({nome:'', email:'', senha:''});
          }.bind(this),
           error: function(resposta) {  // se der ruim.
            if (resposta.status === 400) {
                new TratadorErros().publicaErros(resposta.responseJSON);
            }
           }, 
           beforeSend: function() {
             PubSub.publish('limpa-msg-erro',{});
           }     
         });
    }


      


    setNome(evento) {
        this.setState({nome:evento.target.value});
    }

    setEmail(evento) {
        this.setState({email:evento.target.value});
    }

    setSenha(evento) {
        this.setState({senha:evento.target.value});
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned"  onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} label="Nome"/>

                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} label="E-mail"/>

                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} label="Senha"/>
                
                <ButtonComponent id="gravar" type="submit" label="Gravar"/> 
                </form>             
            </div>      
        );
    }
}

class TabelaAutor extends Component {
   
    render() {
        return (
            <table className="pure-table">
            <thead>
                <tr>
                <th>Nome</th>
                <th>email</th>
                </tr>
            </thead>
            <tbody> {
                 this.props.lista.map(function(autor) {
                     return (
                        <tr key={autor.id}> 
                            <td> {autor.nome}</td>
                            <td>{autor.email}</td>
                        </tr>
                     );
                 })
             }
            </tbody>
            </table> 
        );
    }

}

// component que junta outros components
export class AutorBox extends Component {

    constructor() {
        super();
        this.state = {lista : []};
    }

    componentDidMount() { // inciar antes de montar o component.
        $.ajax({
            url:'http://localhost:8080/api/autores', // onde vai fazer a requisição 
            dataType:'json', // tipo de dato esperado
            success: function(resposta) { // se der bom.
            this.setState({lista:resposta});
            }.bind(this) 
        });
        
        PubSub.subscribe('atualiza-lista-autores', function(topico,novaLista){
            this.setState({lista:novaLista});
        }.bind(this));

            PubSub.subscribe('atualiza-lista-autores', function(topico,novaLista){
            this.setState({lista:novaLista});
        }.bind(this));
    }

    render() {
        return (
            <div>
                <FormularioAutor/>
                <TabelaAutor lista={this.state.lista}/>
            </div>
        );
    }

}