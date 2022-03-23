import React, { FC, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';

import { getIPFSUri, uploadToIPFS } from 'api/ipfs';
import { Tips } from 'api/tips';
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
    const { t } = useTranslation();
    const [file, setFile] = useState<(File & { preview: string }) | null>(null);
    const [illustrationUrl, setIllustrationUrl] = useState<string | undefined>(currentMetadata.illustration && getIPFSUri(currentMetadata.illustration));
    const [submitting, setSubmitting] = useState(false);
    const submit = async (data: any) => {
        setSubmitting(true);
        const illustration = file ? await uploadToIPFS(data.illustration) : currentMetadata.illustration;
        const metadata = JSON.stringify({
            title: data.title,
            description: data.description,
            tags: [],
            illustration: illustration,
        });

        const metadata_cid = await uploadToIPFS(metadata);
        await Tips.instance.updateCampaign(id, metadata_cid);
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
        <div>
            <div className="text-2xl mb-4">{t('tip.edit_modal.title')}</div>

            <form onSubmit={handleSubmit(submit)}>

                <div className="flex flex-col gap-y-4 gap-x-6 mb-4">
                    <div {...getRootProps()} className="relative border rounded-md col-span-3 h-30 md:h-60 flex flex-col justify-center items-center gap-6 cursor-pointer">
                        { file || illustrationUrl ? (
                            <>
                                <button type='button' onClick={removeFile}
                                    className={pictureFloatingTextAction}>
                                    <MinusCircleIcon className='w-4 h-auto'/>
                                    {t('global.remove')}
                                </button>
                                <img className='w-full h-full object-cover' src={file?.preview ?? illustrationUrl} />
                            </>
                        ) : (
                            <>
                                <input type="file" {...getInputProps()} />
                                <UploadImg className='w-20 md:w-40 h-auto' />
                                {
                                    isDragActive ?
                                        <p className='text-sm md:text-base text-gray-500'>{t('tip.edit_modal.drop_files')}</p> :
                                        <p className='text-sm md:text-base text-gray-500'>{t('tip.edit_modal.drag_files')}</p>
                                }
                            </>
                        )}
                    </div>


                    <div>
                        <div className="flex flex-col md:flex-row items-stretch gap-6">
                            <div className='flex-auto'>
                                <label className="block text-sm font-medium text-gray-700">{t('tip.edit_modal.name.label')}</label>
                                <input {...register('title', { required: true })} type="text"
                                    defaultValue={currentMetadata.title}
                                    className="border p-2 w-full rounded-md border-gray-300 leading-5"
                                    placeholder={t('tip.edit_modal.name.placeholder')} />
                                {errors.title?.type === 'required' && (<div className="text-red-400">{t('tip.edit_modal.name.errors.required')}</div>)}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">{t('tip.edit_modal.currency.label')}</label>
                                <div className='border p-2 rounded-md'>EGLD</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">{t('tip.edit_modal.description.label')}</label>
                        <textarea {...register('description', { required: true })}
                            defaultValue={currentMetadata.description}
                            className="h-32 border p-2 w-full rounded-md border-gray-300"
                            placeholder={t('tip.edit_modal.description.placeholder')} />
                        {errors.description?.type === 'required' && (<div className="text-red-400">{t('tip.edit_modal.description.errors.required')}</div>)}
                    </div>

                </div>
                <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-6">
                    <div className="text-xs text-gray-500 w-64">
                        {t('tip.edit_modal.fee_notice')}
                    </div>
                    <button type='submit' className={primaryButton} disabled={submitting}>
                        { submitting ?
                            <LoaderIcon className='w-4 h-6' /> :
                            <>{t('tip.edit_modal.edit')}</>
                        }
                    </button>
                </div>
            </form>

            <div className="text-xs text-gray-500 mt-2 md:mt-10">
                <Trans i18nKey='tip.edit_modal.data_notice'>
                    ⚠︎ Data is stored on <a className='text-main' href='https://ipfs.io/'>IPFS</a> in a <em>immutable permanent</em> way, as soon as you submit this form.
                    Please make sure not to send sensible data.
                </Trans>
            </div>
        </div>
    );
};
