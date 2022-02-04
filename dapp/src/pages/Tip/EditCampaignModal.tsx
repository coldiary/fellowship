import React, { FC, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { getIPFSUri, uploadToIPFS } from 'api/ipfs';
import { updateCampaign } from 'api/tips';
import { ReactComponent as LoaderIcon } from 'assets/img/loader.svg';
import { ReactComponent as MinusCircleIcon } from 'assets/img/minus-circle.svg';
import { ReactComponent as UploadImg } from 'assets/img/upload.svg';
import { pictureFloatingTextAction, primaryButton } from 'components/styles';
import { CampaignMetadata } from 'types/Tips';

interface Props {
    id: number;
    metadata: CampaignMetadata;
    closeModal: () => void;
}

export const EditCampaignModal: FC<Props> = ({ id, metadata: currentMetadata, closeModal }) => {
    const [file, setFile] = useState<(File & { preview: string }) | null>(null);
    const [illustrationUrl, setIllustrationUrl] = useState<string | undefined>(currentMetadata.illustration && getIPFSUri(currentMetadata.illustration));
    const [submitting, setSubmitting] = useState(false);
    const submit = async (data: any) => {
        setSubmitting(true);
        const illustration = file && await uploadToIPFS(data.illustration);
        const metadata = JSON.stringify({
            title: data.title,
            description: data.description,
            tags: data.tags.split(',').filter((_: string) => _),
            illustration: illustration,
        });

        const metadata_cid = await uploadToIPFS(metadata);
        await updateCampaign(id, `https://ipfs.io/ipfs/${metadata_cid}`);
        closeModal();
    };

    const removeFile = () => {
        setFile(null);
        setIllustrationUrl(undefined);
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
            <div className="text-2xl mb-4">Edit campaign</div>

            <form onSubmit={handleSubmit(submit)}>

                <div className="flex flex-col gap-y-4 gap-x-6 mb-4">
                    <div {...getRootProps()} className="relative border rounded-md col-span-3 h-60 flex flex-col justify-center items-center gap-6 cursor-pointer">
                        { file || illustrationUrl ? (
                            <>
                                <button type='button' onClick={removeFile}
                                    className={pictureFloatingTextAction}>
                                    <MinusCircleIcon className='w-4 h-auto'/>
                                    Remove
                                </button>
                                <img className='w-full h-full object-cover' src={file?.preview ?? illustrationUrl} />
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
                                    defaultValue={currentMetadata.title}
                                    className="border p-2 w-full rounded-md border-gray-300 leading-5"
                                    placeholder="Support my activity !" />
                                {errors.title?.type === 'required' && (<div className="text-red-400">Title is required</div>)}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Currency</label>
                                <div className='border p-2 rounded-md'>EGLD</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea {...register('description', { required: true })}
                            defaultValue={currentMetadata.description}
                            className="h-32 border p-2 w-full rounded-md border-gray-300"
                            placeholder="I do great stuff for a living. Please help me make it awesome !" />
                        {errors.description?.type === 'required' && (<div className="text-red-400">Description is required</div>)}
                    </div>

                    <div className='col-span-3'>
                        <div className="flex flex-row gap-6">
                            <div className='flex-auto'>
                                <label className="block text-sm font-medium text-gray-700">Tags</label>
                                <input {...register('tags')} type='text'
                                    defaultValue={currentMetadata.tags}
                                    placeholder='Any tag useful to filter it'
                                    className='border p-2 rounded-sm w-full' />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-row justify-end items-center gap-6">
                    <div className="text-xs text-gray-500 w-64">
                        Editing a campaign requires a transaction on the Elrond Network (Tx fee: ~0.001egld)
                    </div>
                    <button type='submit' className={primaryButton} disabled={submitting}>
                        { submitting ?
                            <LoaderIcon className='w-4 h-6' /> :
                            <>Edit campaign</>
                        }
                    </button>
                </div>
            </form>

            <div className="text-sm text-gray-500 mt-10">
                ⚠︎ Data is stored on <a className='text-main' href='https://ipfs.io/'>IPFS</a> in a <em>immutable permanent</em> way, as soon as you submit this form.
                Please make sure not to send sensible data.
            </div>
        </div>
    );
};
