import {LinkedinIcon as Icon} from 'next-share';

export default function LinkedinIcon({link = undefined}: {link?: string}) {
  return link ? (
    <a href={link} target='_blank' rel='noreferrer'>
      <Icon size={24} round style={{}} />
    </a>
  ) : (
    <Icon size={24} round style={{}} />
  );
}
