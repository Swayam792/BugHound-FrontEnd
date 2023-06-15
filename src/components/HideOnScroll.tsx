import { useScrollTrigger, Slide } from '@mui/material';

const HideOnScroll: React.FC<{ children: React.ReactElement<any, any> }> = ({
  children,
}) => {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="up" in={!trigger}>
      {children}
    </Slide>
  );
};

export default HideOnScroll;
