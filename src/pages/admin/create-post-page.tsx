import React, { ChangeEvent, FormEvent, useState } from 'react';
import api from '../../api';
import axios from 'axios';
import GetUrl from '../../database';


const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<string[]>([]); // Armazena as tags
    const [error, setError] = useState('');
    
    const [file, setFile] = useState();

    function handleChange(event:ChangeEvent<HTMLFormElement>) {
        setFile(event.target.files[0])
      }
      
    
    

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!title.trim() || !description.trim()) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setError('');

        try {
            const formData = new FormData();
            if(file){
formData.append('image', file);
            }
            
            formData.append('title', title);
            formData.append('description', description);
            formData.append('tags', JSON.stringify(categories));

            const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
            };
            const response = await axios.post(GetUrl()+'/post', formData, config)
     
            alert(`Post Criado!\nTítulo: ${response.data.title}\nDescrição: ${response.data.description}`);
            setTitle('');
            setFile(null);
            setDescription('');
            setCategories([]);
          } catch (error) {
            console.error('Erro ao criar post:', error);
            setError('Falha ao criar post.');
          }
        };

    const addCategory = (category: string) => {
        if (category && !categories.includes(category)) {
            setCategories(prev => [...prev, category]);
        }
    };

    const removeCategory = (category: string) => {
        setCategories(prev => prev.filter(c => c !== category));
    };
   
    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Criar Novo Post</h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-gray-700 text-lg font-semibold mb-2">Título:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Digite o título do post"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="tags" className="block text-gray-700 text-lg font-semibold mb-2">Categorias:</label>
                        <div className="flex mb-2">
                            {categories.map((category) => (
                                <div key={category} className="py-1.5 px-2.5 rounded-md bg-gray-200 flex items-center justify-center gap-2 mr-2">
                                    <span className="text-gray-800">{category}</span>
                                    <button type="button" onClick={() => removeCategory(category)} className="text-red-600 hover:text-red-800">X</button>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Digite uma categoria e pressione Enter"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = (e.target as HTMLInputElement).value;
                                    addCategory(input);
                                    (e.target as HTMLInputElement).value = '';
                                }
                            }}
                        />
                    </div>
                    <div className='mb-6'>
                        <input 
                        onChange={e => {
                            if(e.target.files?[0] !== null){
                                return;
                            } 
                            setFile(e.target.files?[0]);
                        }}
                        type="file" 
                        name="" 
                        id="" />
                        
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-700 text-lg font-semibold mb-2">Descrição:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Digite a descrição do post"
                            rows={6}
                        ></textarea>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm italic mb-4">{error}</p>
                    )}

                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline">
                        Criar Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;
