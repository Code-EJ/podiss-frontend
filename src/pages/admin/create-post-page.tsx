import { contentService } from '../../services/content-service';
import { useAsyncAction } from '../../hooks/use-async-action';
import { Button } from '../../components/ui/button';
import { Alert } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { FormEvent, useState, useRef } from 'react';



/**
 * Creates editorial content as multipart fields. Tags are repeated fields; image is optional and bounded.
 * @author oEnzoRibas
 */
const CreatePostPage = () => {
    const fileInput = useRef<HTMLInputElement>(null);
    const { busy: submitting, error: actionError, run } = useAsyncAction();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [file, setFile] = useState<File>();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (submitting) return;

        if (!title.trim() || !description.trim()) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        setError('');

        const result = await run(() => contentService.createPost(title, description, categories, file), {
            loading: 'Criando post...', success: 'Post criado com sucesso!',
        });
        if (result.ok) {
            setTitle(''); setFile(undefined); setDescription(''); setCategories([]);
            if (fileInput.current) fileInput.current.value = '';
        }
    };

    const addCategory = (category: string) => {
        if (category.length > 80 || category.includes(',') || categories.length >= 20) {
            setError('Use até 20 categorias, com até 80 caracteres e sem vírgulas.'); return;
        }
        if (category && !categories.includes(category)) {
            setCategories(prev => [...prev, category]);
        }
    };

    const removeCategory = (category: string) => {
        setCategories(prev => prev.filter(c => c !== category));
    };

    return (
        <div className="px-4 py-8 sm:px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Criar Novo Post</h1>
                <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-8 rounded-xl border border-gray-200 shadow-sm">
                    <fieldset disabled={submitting} className="min-w-0">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-gray-700 text-lg font-semibold mb-2">Título:</label>
                        <input
                            type="text"
                            id="title" required maxLength={255}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Digite o título do post"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="tags" className="block text-gray-700 text-lg font-semibold mb-2">Categorias:</label>
                        <div className="flex mb-2 flex-wrap">
                            {categories.map((category) => (
                                <div key={category} className="py-1.5 px-2.5 rounded-md bg-gray-200 flex items-center justify-center gap-2 mr-2 mb-2">
                                    <Badge>{category}</Badge>
                                    <button type="button" aria-label={`Remover categoria ${category}`} onClick={() => removeCategory(category)} className="text-red-600 hover:text-red-800">X</button>
                                </div>
                            ))}
                        </div>
                        <input
                            type="text"
                            id="tags" placeholder="Digite uma categoria e pressione Enter"
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = (e.target as HTMLInputElement).value.trim();
                                    if (input) {
                                        addCategory(input);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }
                            }}
                        />
                    </div>

                    <div className='mb-6'>
                        <input
                            ref={fileInput} aria-label="Imagem do post" type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            onChange={e => {
                                const fileSelected = e.target.files?.[0];
                                if (fileSelected) {
                                    setFile(fileSelected);
                                }
                            }}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-700 text-lg font-semibold mb-2">Descrição:</label>
                        <textarea
                            id="description" required maxLength={10000}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Digite a descrição do post"
                            rows={6}
                        ></textarea>
                    </div>

                    <Alert message={error || actionError} />

                    <Button type="submit" loading={submitting} loadingText="Criando post...">Criar Post</Button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default CreatePostPage;
