import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { uploadToIPFS } from 'api/ipfs';
import { createCampaign } from 'api/tips/createCampaign';
import { ReactComponent as MinusCircleIcon } from 'assets/img/minus-circle.svg';
import { ReactComponent as UploadImg } from 'assets/img/upload.svg';
import { pictureFloatingTextAction, primaryButton } from 'components/styles';

export const CreateCampaignModal = () => {
    const [file, setFile] = useState<(File & { preview: string }) | null>(null);
    const submit = async (data: any) => {
        const illustration = file && await uploadToIPFS(data.illustration);
        const metadata = JSON.stringify({
            title: data.title,
            description: data.description,
            tags: data.tags.split(',').filter((_: string) => _),
            illustration: illustration,
        });

        const metadata_cid = await uploadToIPFS(metadata);
        await createCampaign(
            `https://ipfs.io/ipfs/${metadata_cid}`,
            data.currency,
        );
    };

    const removeFile = () => {
        setFile(null);
        setValue('illustration', undefined);
    };

    const onDrop = useCallback(acceptedFiles => {
        setFile({ ...acceptedFiles[0], preview: URL.createObjectURL(acceptedFiles[0]) });
        setValue('illustration', acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: 'image/jpeg, image/png'
    });

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    return (
        <div className='p-6'>
            <div className="text-2xl mb-4">Create a campaign</div>

            <form onSubmit={handleSubmit(submit)}>

                <div className="flex flex-col gap-y-4 gap-x-6 mb-4">
                    <div {...getRootProps()} className="relative border rounded-md col-span-3 h-60 flex flex-col justify-center items-center gap-6 cursor-pointer">
                        { file ? (
                            <>
                                <button type='button' onClick={removeFile}
                                    className={pictureFloatingTextAction}>
                                    <MinusCircleIcon className='w-4 h-auto'/>
                                    Remove
                                </button>
                                <img className='w-full h-full object-cover' src={file.preview} />
                            </>
                        ) : (
                            <>
                                <input type="file" {...getInputProps()} />
                                <UploadImg className='w-40 h-auto' />
                                {
                                    isDragActive ?
                                        <p className='text-gray-500'>Drop the files here ...</p> :
                                        <p className='text-gray-500'>Drag some files here, or click to select files</p>
                                }
                            </>
                        )}
                    </div>


                    <div>
                        <div className="flex flex-row items-stretch gap-6">
                            <div className='flex-auto'>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input {...register('title', { required: true })} type="text"
                                    className="border p-2 w-full rounded-md border-gray-300 leading-5"
                                    placeholder="Support my activity !" />
                                {errors.title?.type === 'required' && (<div className="text-red-400">Title is required</div>)}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Currency</label>
                                <select {...register('currency', { required: true })} className='border p-2 rounded-md'>
                                    <option>EGLD</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea {...register('description', { required: true })}
                            className="h-32 border p-2 w-full rounded-md border-gray-300"
                            placeholder="I do great stuff for a living. Please help me make it awesome !" />
                        {errors.description?.type === 'required' && (<div className="text-red-400">Description is required</div>)}
                    </div>

                    <div className='col-span-3'>
                        <div className="flex flex-row gap-6">
                            <div className='flex-auto'>
                                <label className="block text-sm font-medium text-gray-700">Tags</label>
                                <input {...register('tags')} type='text' placeholder='Any tag useful to filter it'
                                    className='border p-2 rounded-sm w-full' />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-row justify-end items-center gap-6">
                    <div className="text-xs text-gray-500 w-64">
                        Creating a campaign requires a transaction on the Elrond Network (Tx fee: ~0.001egld)
                    </div>
                    <button type='submit' className={primaryButton}>Create campaign</button>
                </div>
            </form>

            <div className="text-sm text-gray-500 mt-10">
                ⚠︎ Data is stored on <a className='text-main' href='https://ipfs.io/'>IPFS</a> in a <em>immutable permanent</em> way, as soon as you submit this form.
                Please make sure not to send sensible data.
            </div>
        </div>
    );
};
