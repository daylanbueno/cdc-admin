import $ from "jquery"
import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import TratadorErros from "./TratadorErros";
import InputCustomizado from "./InputCustomizado";
import ButtonComponent from './ButtonComponent';


class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = {titulo:'',preco:'',autorId:''};
        this.enviaForm = this.enviaForm.bind(this); // bind(this) quer dizer que o this é do react.
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }

    enviaForm(evento){
        evento.preventDefault();
        $.ajax({
           url:'http://localhost:8080/api/livros',
           contentType:'application/json', // indicando formado que dados para ser enviado
           dataType:'json', // qual tipo de resposta vai receber
           type:'post', // tipo de requisição
           data: JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autorId:this.state.autorId}),
           success: function(novaLista) { // se der bom.
             console.log("enviado com sucesso");
             PubSub.publish('atualiza-lista-livros',novaLista);
             this.setState({titulo:'', preco:'', autorId:''});
          }.bind(this),
           error: function(resposta) {  // se der ruim.
            if (resposta.status === 400) {
                new TratadorErros().publicaErros(resposta.responseJSON);
            }
           }, 
           beforeSend: function() { // antes de enviar limpamos todos os erros.
             PubSub.publish('limpa-msg-erro',{});
           }     
         });
    }

    setTitulo(evento) {
        this.setState({titulo:evento.target.value});
    }

    setPreco(evento) {
        this.setState({preco:evento.target.value});
    }

    setAutorId(evento) {
        console.log(evento.target.value);
        this.setState({autorId:evento.target.value});
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned"  onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="titulo" type="text" name="titulo" value={this.state.titulo} onChange={this.setTitulo} label="Titulo:"/>

                    <InputCustomizado id="preco" type="text" name="preco" value={this.state.preco} onChange={this.setPreco} label="Preço:"/>
                   
                    <div className="pure-control-group">
                        <label htmlFor="autorId">Autor:</label> 
                        <select value={this.state.autorId} name="autorId" id="autorID" onChange={this.setAutorId}>
                            <option value="">Selecione o autor</option>
                            {
                                this.props.autores.map(function(autor){
                                    return <option value={autor.id}>{autor.nome}</option>
                                })
                            }
                        </select> 
                    </div>   

                <ButtonComponent id="gravar" type="submit" label="Gravar"/> 
                </form>             
            </div>      
        );
    }
}

class TabelaLivros extends Component {
    render() {
        console.log('LISTA=>',this.props.lista);
        return (
        <div>
            <table className="pure-table">
                <thead>
                    <tr>
                        <th>Titulo</th>
                        <th>Preço</th>
                        <th>Autor</th>
                    </tr>
                </thead>
                <tbody> 
                {
                    this.props.lista.map(function(livro) {
                        return (
                            <tr key={livro.id}> 
                                <td> {livro.titulo}</td>
                                <td>{livro.preco}</td>
                                <td> {livro.autor.nome}</td>
                            </tr>
                        );
                    })
                }
                </tbody>
                </table> 
            </div>
        );
    }
  }

export default class LivroBox extends Component {
   
    constructor() {
        super();
        this.state = {lista : [], autores:[]};
    }

    componentDidMount() { // inciar antes de montar o component.
        console.log("didMount LIvroBox executando");
        $.ajax({
            url:'http://localhost:8080/api/livros', // onde vai fazer a requisição 
            dataType:'json', // tipo de dato esperado
            success: function(resposta) { // se der bom.
                PubSub.publish('atualiza-lista-livros',resposta);
            }.bind(this) 
        });

        $.ajax({
            url:'http://localhost:8080/api/autores', // onde vai fazer a requisição 
            dataType:'json', // tipo de dato esperado
            success: function(resposta) { // se der bom.
                PubSub.publish('atualiza-lista-autores',resposta);
            }.bind(this) 
        });
        
        PubSub.subscribe('atualiza-lista-livros', function(topico,novaLista){
            console.log("Ouvindo resposta");
            this.setState({lista:novaLista});
        }.bind(this));

        PubSub.subscribe('atualiza-lista-autores', function(topico,listaAutores){
            console.log("Ouvindo resposta =>autores");
            this.setState({autores:listaAutores});
        }.bind(this));
    }

    render() {
        console.log("Lista para paramentro"+this.state.lista);
        return (
            <div>
               <div className="header">
                    <h1>Cadastro de livro</h1>
                </div>     
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores} />
                    <TabelaLivros lista={this.state.lista}/>
                </div>  
            </div>
        );
    }

}